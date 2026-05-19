// Deterministic in-browser prediction engine that mirrors the FastAPI ML pipeline.
// Inputs match the project spec sample exactly.

export interface SensorInput {
  machine_id: string;
  temperature: number;   // °C
  vibration: number;     // mm/s
  pressure: number;      // bar
  rpm: number;
  voltage: number;
  current: number;
  torque: number;        // Nm
  humidity: number;      // %
  operating_hours: number;
}

export type RiskLevel = "Low" | "Medium" | "High";
export type AnomalyStatus = "Normal" | "Anomaly";
export type AlertLevel = "Normal" | "Warning" | "Critical";

export interface PredictionResult {
  machine_id: string;
  failure_risk: RiskLevel;
  failure_probability: number;
  remaining_useful_life: number;
  anomaly_status: AnomalyStatus;
  health_score: number;
  maintenance_recommendation: string;
  alert_level: AlertLevel;
  timestamp: string;
}

// Nominal operating envelopes — used as "feature engineering" baseline.
const NOMINAL = {
  temperature: { min: 40, max: 75 },
  vibration:   { min: 0.1, max: 0.5 },
  pressure:    { min: 20, max: 35 },
  rpm:         { min: 1200, max: 1600 },
  voltage:     { min: 215, max: 245 },
  current:     { min: 5, max: 11 },
  torque:      { min: 25, max: 45 },
  humidity:    { min: 30, max: 65 },
};

function deviation(value: number, range: { min: number; max: number }) {
  const span = range.max - range.min;
  if (value < range.min) return (range.min - value) / span;
  if (value > range.max) return (value - range.max) / span;
  return 0;
}

function clamp(n: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, n));
}

export function predict(input: SensorInput): PredictionResult {
  // Per-sensor deviation (0 = nominal, >1 = significantly out of range)
  const devs = {
    temperature: deviation(input.temperature, NOMINAL.temperature),
    vibration:   deviation(input.vibration,   NOMINAL.vibration),
    pressure:    deviation(input.pressure,    NOMINAL.pressure),
    rpm:         deviation(input.rpm,         NOMINAL.rpm),
    voltage:     deviation(input.voltage,     NOMINAL.voltage),
    current:     deviation(input.current,     NOMINAL.current),
    torque:      deviation(input.torque,      NOMINAL.torque),
    humidity:    deviation(input.humidity,    NOMINAL.humidity),
  };

  // Weighted failure probability — mirrors XGBoost feature importances.
  const weights = {
    temperature: 0.20, vibration: 0.25, pressure: 0.10, rpm: 0.08,
    voltage: 0.06, current: 0.08, torque: 0.10, humidity: 0.03,
  };
  let score = 0;
  let totalW = 0;
  for (const k in weights) {
    const w = weights[k as keyof typeof weights];
    score += Math.min(devs[k as keyof typeof devs], 2) * w;
    totalW += w;
  }
  // Operating hours stress (degradation accelerates past 5000h)
  const hoursStress = clamp((input.operating_hours - 3000) / 5000, 0, 1);
  const raw = (score / totalW) * 0.75 + hoursStress * 0.25;
  const failure_probability = Math.round(clamp(raw, 0.02, 0.98) * 100) / 100;

  // Risk bucket
  const failure_risk: RiskLevel =
    failure_probability >= 0.65 ? "High" :
    failure_probability >= 0.35 ? "Medium" : "Low";

  // RUL — inversely related to risk + hours used
  const baseRUL = 2000;
  const remaining_useful_life = Math.max(
    10,
    Math.round(baseRUL * (1 - failure_probability) - input.operating_hours * 0.15)
  );

  // Anomaly detection — Isolation-Forest-style: any sensor far out of range
  const maxDev = Math.max(...Object.values(devs));
  const anomaly_status: AnomalyStatus = maxDev > 0.8 ? "Anomaly" : "Normal";

  // Health score 0–100
  const health_score = Math.round(
    clamp((1 - failure_probability) * 70 + (remaining_useful_life / baseRUL) * 30, 0, 100)
  );

  // Alert level
  const alert_level: AlertLevel =
    failure_risk === "High" || health_score < 30 ? "Critical" :
    failure_risk === "Medium" || anomaly_status === "Anomaly" ? "Warning" : "Normal";

  // Recommendation
  let rec =
    failure_risk === "High" ? "Immediate maintenance required." :
    failure_risk === "Medium" ? "Schedule maintenance soon." :
    "Machine operating normally.";
  if (anomaly_status === "Anomaly") rec += " Sensor anomaly detected — inspect readings.";

  return {
    machine_id: input.machine_id,
    failure_risk,
    failure_probability,
    remaining_useful_life,
    anomaly_status,
    health_score,
    maintenance_recommendation: rec,
    alert_level,
    timestamp: new Date().toISOString(),
  };
}

// ───── Sample fleet generator ────────────────────────────────────────────────
const MACHINE_TYPES = ["CNC Mill", "Hydraulic Press", "Turbine", "Compressor", "Conveyor", "Pump"];

function seeded(seed: number) {
  let s = seed;
  return () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
}

export function generateFleet(count = 24): Array<SensorInput & { type: string }> {
  const rnd = seeded(42);
  return Array.from({ length: count }, (_, i) => {
    const stress = rnd();             // 0 = healthy, 1 = degraded
    const mult = 1 + stress * 0.6;
    return {
      machine_id: `M-${(101 + i).toString()}`,
      type: MACHINE_TYPES[i % MACHINE_TYPES.length],
      temperature: Math.round((50 + rnd() * 25 * mult) * 10) / 10,
      vibration:   Math.round((0.2 + rnd() * 0.7 * mult) * 100) / 100,
      pressure:    Math.round((22 + rnd() * 15 * mult) * 10) / 10,
      rpm:         Math.round(1300 + rnd() * 400 * mult),
      voltage:     Math.round(220 + rnd() * 25),
      current:     Math.round((6 + rnd() * 8 * mult) * 10) / 10,
      torque:      Math.round((28 + rnd() * 25 * mult) * 10) / 10,
      humidity:    Math.round(35 + rnd() * 40),
      operating_hours: Math.round(800 + rnd() * 7000),
    };
  });
}

export function generateTrend(hours = 24) {
  const rnd = seeded(7);
  return Array.from({ length: hours }, (_, i) => ({
    hour: `${i.toString().padStart(2, "0")}:00`,
    temperature: Math.round((60 + Math.sin(i / 3) * 8 + rnd() * 4) * 10) / 10,
    vibration:   Math.round((0.4 + Math.cos(i / 4) * 0.15 + rnd() * 0.1) * 100) / 100,
    pressure:    Math.round((28 + Math.sin(i / 5) * 3 + rnd() * 1.5) * 10) / 10,
    rpm:         Math.round(1450 + Math.sin(i / 2) * 80 + rnd() * 30),
  }));
}
