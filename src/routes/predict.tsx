import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Shell, PageHeader } from "@/components/site/Shell";
import { AlertBadge, AnomalyBadge, HealthBar, RiskBadge } from "@/components/site/Badges";
import { predict, type PredictionResult, type SensorInput } from "@/lib/predict";
import { addPrediction } from "@/lib/store";
import { Sparkles, Download } from "lucide-react";

export const Route = createFileRoute("/predict")({
  head: () => ({ meta: [{ title: "Single Prediction — MachineGuard AI" }, { name: "description", content: "Run a live failure-risk prediction on a single machine's sensor readings." }] }),
  component: PredictPage,
});

const SAMPLE: SensorInput = {
  machine_id: "M-101", temperature: 82.5, vibration: 0.76, pressure: 31.2,
  rpm: 1480, voltage: 230, current: 12.5, torque: 45.8, humidity: 55, operating_hours: 4200,
};

const FIELDS: Array<{ key: keyof Omit<SensorInput, "machine_id">; label: string; unit: string; step: number }> = [
  { key: "temperature",     label: "Temperature",      unit: "°C",   step: 0.1 },
  { key: "vibration",       label: "Vibration",        unit: "mm/s", step: 0.01 },
  { key: "pressure",        label: "Pressure",         unit: "bar",  step: 0.1 },
  { key: "rpm",             label: "RPM",              unit: "rpm",  step: 1 },
  { key: "voltage",         label: "Voltage",          unit: "V",    step: 1 },
  { key: "current",         label: "Current",          unit: "A",    step: 0.1 },
  { key: "torque",          label: "Torque",           unit: "Nm",   step: 0.1 },
  { key: "humidity",        label: "Humidity",         unit: "%",    step: 1 },
  { key: "operating_hours", label: "Operating hours",  unit: "h",    step: 10 },
];

function PredictPage() {
  const [input, setInput] = useState<SensorInput>(SAMPLE);
  const [result, setResult] = useState<PredictionResult | null>(predict(SAMPLE));

  const update = (k: keyof SensorInput, v: string) => {
    setInput((prev) => ({ ...prev, [k]: k === "machine_id" ? v : Number(v) }));
  };

  const run = () => {
    const r = predict(input);
    setResult(r);
    addPrediction(r);
  };

  const download = () => {
    if (!result) return;
    const blob = new Blob([JSON.stringify(result, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `${result.machine_id}-prediction.json`; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Shell>
      <PageHeader eyebrow="Inference" title="Single Machine Prediction" description="Enter sensor readings to forecast failure risk, RUL, and anomaly status." />
      <div className="mx-auto grid max-w-7xl gap-6 px-6 pb-12 lg:grid-cols-5">
        <div className="glass rounded-2xl p-6 lg:col-span-3">
          <div className="mb-4 flex items-center justify-between">
            <div className="text-sm font-semibold">Sensor Inputs</div>
            <button onClick={() => { setInput(SAMPLE); setResult(predict(SAMPLE)); }} className="text-xs text-primary hover:underline">Load sample</button>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Machine ID" unit="">
              <input value={input.machine_id} onChange={(e) => update("machine_id", e.target.value)} className={inputCls} />
            </Field>
            {FIELDS.map((f) => (
              <Field key={f.key} label={f.label} unit={f.unit}>
                <input type="number" step={f.step} value={input[f.key]} onChange={(e) => update(f.key, e.target.value)} className={inputCls} />
              </Field>
            ))}
          </div>
          <button onClick={run} className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-primary to-accent px-6 py-3 font-medium text-primary-foreground shadow-glow transition hover:opacity-90">
            <Sparkles className="h-4 w-4" /> Run Prediction
          </button>
        </div>

        <div className="lg:col-span-2">
          {result ? <ResultCard r={result} onDownload={download} /> : null}
        </div>
      </div>
    </Shell>
  );
}

const inputCls = "w-full rounded-lg border border-border bg-input/50 px-3 py-2 font-mono text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary";

function Field({ label, unit, children }: { label: string; unit: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="mb-1.5 flex items-center justify-between text-xs">
        <span className="font-medium text-muted-foreground">{label}</span>
        {unit && <span className="font-mono text-muted-foreground">{unit}</span>}
      </div>
      {children}
    </label>
  );
}

function ResultCard({ r, onDownload }: { r: PredictionResult; onDownload: () => void }) {
  const pct = Math.round(r.failure_probability * 100);
  return (
    <div className="glass-strong sticky top-24 rounded-2xl p-6 shadow-elevated">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs uppercase tracking-widest text-muted-foreground">Result</div>
          <div className="font-mono text-lg font-semibold">{r.machine_id}</div>
        </div>
        <AlertBadge level={r.alert_level} />
      </div>

      <div className="mt-5 space-y-4">
        <div>
          <div className="flex items-center justify-between text-xs text-muted-foreground"><span>Failure Probability</span><span className="font-mono">{pct}%</span></div>
          <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-secondary">
            <div className="h-full rounded-full bg-gradient-to-r from-success via-warning to-destructive" style={{ width: `${pct}%` }} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Stat label="Failure Risk" value={<RiskBadge risk={r.failure_risk} />} />
          <Stat label="Anomaly" value={<AnomalyBadge status={r.anomaly_status} />} />
          <Stat label="Remaining Useful Life" value={<span className="font-mono text-lg font-bold">{r.remaining_useful_life}<span className="text-xs text-muted-foreground"> h</span></span>} />
          <Stat label="Health Score" value={<div className="flex flex-col gap-1.5"><span className="font-mono text-lg font-bold">{r.health_score}<span className="text-xs text-muted-foreground">/100</span></span><HealthBar score={r.health_score} /></div>} />
        </div>

        <div className="rounded-xl border border-primary/20 bg-gradient-to-br from-primary/10 to-accent/5 p-4 text-sm">
          <div className="text-xs font-semibold uppercase tracking-widest text-primary">Recommendation</div>
          <div className="mt-1.5">{r.maintenance_recommendation}</div>
        </div>

        <button onClick={onDownload} className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-secondary/40 px-4 py-2 text-sm font-medium transition hover:bg-secondary">
          <Download className="h-4 w-4" /> Download JSON report
        </button>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border/60 bg-card/40 p-3">
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className="mt-1.5">{value}</div>
    </div>
  );
}
