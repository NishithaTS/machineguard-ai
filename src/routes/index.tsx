import { createFileRoute, Link } from "@tanstack/react-router";
import { Activity, AlertTriangle, BarChart3, Brain, Cpu, Database, Gauge, LineChart, ShieldCheck, Sparkles, UploadCloud, Workflow, Zap } from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MachineGuard AI — Predict failures before they happen" },
      { name: "description", content: "Industrial ML platform that forecasts equipment failures, estimates Remaining Useful Life, and detects anomalies from sensor data." },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Hero />
        <Stats />
        <Features />
        <HowItWorks />
        <Stack />
        <Benefits />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden bg-hero">
      <div className="absolute inset-0 bg-grid opacity-40" />
      <div className="absolute -top-32 right-0 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
      <div className="absolute -bottom-32 left-0 h-96 w-96 rounded-full bg-accent/20 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl gap-12 px-6 pt-20 pb-24 lg:grid-cols-2 lg:items-center lg:pt-28">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            <Sparkles className="h-3.5 w-3.5" /> Industry 4.0 · Predictive Maintenance
          </div>
          <h1 className="mt-5 font-display text-5xl font-bold leading-[1.05] tracking-tight md:text-6xl lg:text-7xl">
            Predict failures<br />
            <span className="gradient-text">before they happen.</span>
          </h1>
          <p className="mt-5 max-w-xl text-lg text-muted-foreground">
            MachineGuard AI analyzes vibration, temperature, pressure and 6 more sensor signals to forecast machine failures,
            estimate Remaining Useful Life, and surface anomalies — turning reactive downtime into preventive action.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/dashboard" className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-primary to-accent px-6 py-3 font-medium text-primary-foreground shadow-glow transition hover:opacity-90">
              Get Started <Zap className="h-4 w-4" />
            </Link>
            <Link to="/predict" className="inline-flex items-center gap-2 rounded-lg border border-border bg-secondary/40 px-6 py-3 font-medium text-foreground backdrop-blur transition hover:bg-secondary">
              View Demo <Activity className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-primary" /> XGBoost · Random Forest · LSTM</div>
            <div className="flex items-center gap-2"><Database className="h-4 w-4 text-primary" /> CSV batch & real-time inference</div>
          </div>
        </div>

        <div className="relative">
          <HeroVisual />
        </div>
      </div>
    </section>
  );
}

function HeroVisual() {
  const sensors = [
    { label: "Temperature", value: "82.5°C", icon: Activity, status: "high" },
    { label: "Vibration",   value: "0.76 mm/s", icon: Workflow, status: "high" },
    { label: "Pressure",    value: "31.2 bar", icon: Gauge, status: "ok" },
    { label: "RPM",         value: "1480",      icon: Cpu, status: "ok" },
  ];
  return (
    <div className="relative">
      <div className="glass-strong relative rounded-3xl p-6 shadow-elevated">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs uppercase tracking-widest text-muted-foreground">Machine</div>
            <div className="font-mono text-lg font-semibold">M-101 · Hydraulic Press</div>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-destructive/30 bg-destructive/10 px-3 py-1 text-xs font-medium text-destructive">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-destructive opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-destructive" />
            </span>
            High Risk
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3">
          {sensors.map((s) => (
            <div key={s.label} className="rounded-xl border border-border/60 bg-card/40 p-3">
              <div className="flex items-center justify-between">
                <s.icon className={`h-4 w-4 ${s.status === "high" ? "text-destructive" : "text-primary"}`} />
                <span className={`h-1.5 w-1.5 rounded-full ${s.status === "high" ? "bg-destructive" : "bg-success"}`} />
              </div>
              <div className="mt-2 font-mono text-lg font-semibold">{s.value}</div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-xl border border-primary/20 bg-gradient-to-br from-primary/10 to-accent/5 p-4">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Failure Probability</span><span>87%</span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-secondary">
            <div className="h-full rounded-full bg-gradient-to-r from-warning via-destructive to-destructive" style={{ width: "87%" }} />
          </div>
          <div className="mt-4 grid grid-cols-3 gap-3 text-center">
            <div>
              <div className="font-mono text-lg font-bold text-destructive">120h</div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">RUL</div>
            </div>
            <div>
              <div className="font-mono text-lg font-bold text-warning">28</div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Health</div>
            </div>
            <div>
              <div className="font-mono text-lg font-bold text-destructive">Critical</div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Alert</div>
            </div>
          </div>
          <div className="mt-4 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive">
            ⚠ Immediate maintenance required. Sensor anomaly detected.
          </div>
        </div>
      </div>

      <div className="absolute -right-4 -top-4 hidden h-24 w-24 rounded-2xl border border-primary/30 bg-primary/10 backdrop-blur md:block float" />
      <div className="absolute -bottom-6 -left-6 hidden h-32 w-32 rounded-full border border-accent/30 bg-accent/10 backdrop-blur md:block" />
    </div>
  );
}

function Stats() {
  const stats = [
    { v: "9", l: "Sensor inputs analyzed" },
    { v: "3", l: "ML models in pipeline" },
    { v: "<200ms", l: "Inference latency" },
    { v: "0–100", l: "Health score range" },
  ];
  return (
    <section className="border-y border-border/60 bg-card/30">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px overflow-hidden md:grid-cols-4">
        {stats.map((s) => (
          <div key={s.l} className="bg-background/40 px-6 py-8 text-center">
            <div className="font-display text-3xl font-bold gradient-text">{s.v}</div>
            <div className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">{s.l}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Features() {
  const feats = [
    { icon: Brain,         t: "Failure Risk Prediction", d: "XGBoost + Random Forest classifies machines as Low, Medium, or High risk with probability scoring." },
    { icon: LineChart,     t: "Remaining Useful Life",   d: "Regressors estimate cycles/hours remaining before failure so you can plan maintenance windows." },
    { icon: AlertTriangle, t: "Anomaly Detection",       d: "Isolation Forest catches unusual sensor patterns indicating hidden faults before they escalate." },
    { icon: Gauge,         t: "Health Score (0–100)",    d: "Composite score blends failure probability, RUL, and sensor abnormalities into one number." },
    { icon: UploadCloud,   t: "Batch CSV Inference",     d: "Drop a CSV of sensor readings and get instant predictions across your entire fleet." },
    { icon: BarChart3,     t: "Live Analytics",          d: "Recharts dashboards visualize risk distribution, sensor trends, and anomaly counts over time." },
  ];
  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <div className="mx-auto max-w-2xl text-center">
        <div className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Capabilities</div>
        <h2 className="mt-3 font-display text-4xl font-bold tracking-tight">An ML pipeline for the factory floor</h2>
        <p className="mt-3 text-muted-foreground">Six tightly-integrated modules that turn raw sensor streams into preventive action.</p>
      </div>
      <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {feats.map((f) => (
          <div key={f.t} className="group glass rounded-2xl p-6 transition hover:border-primary/40 hover:shadow-glow">
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 text-primary transition group-hover:from-primary group-hover:to-accent group-hover:text-primary-foreground">
              <f.icon className="h-5 w-5" />
            </div>
            <h3 className="mt-5 font-display text-lg font-semibold">{f.t}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{f.d}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    { n: "01", t: "Sensor Data",        d: "Temperature, vibration, pressure, RPM, voltage, current, torque, humidity, hours." },
    { n: "02", t: "Preprocessing",      d: "Cleaning, normalization, and feature engineering on every reading." },
    { n: "03", t: "ML Inference",       d: "XGBoost, Random Forest, and Isolation Forest run in parallel." },
    { n: "04", t: "Health & Alerts",    d: "Composite score, RUL, and alert level trigger maintenance actions." },
  ];
  return (
    <section className="border-y border-border/60 bg-card/20">
      <div className="mx-auto max-w-7xl px-6 py-24">
        <div className="mx-auto max-w-2xl text-center">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">How it works</div>
          <h2 className="mt-3 font-display text-4xl font-bold tracking-tight">Sensor stream to maintenance ticket in 4 steps</h2>
        </div>
        <div className="mt-14 grid gap-4 md:grid-cols-4">
          {steps.map((s, i) => (
            <div key={s.n} className="relative glass rounded-2xl p-6">
              <div className="font-mono text-xs text-primary">{s.n}</div>
              <h3 className="mt-2 font-display text-lg font-semibold">{s.t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.d}</p>
              {i < steps.length - 1 && (
                <div className="absolute -right-2 top-1/2 hidden h-px w-4 bg-gradient-to-r from-primary to-transparent md:block" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Stack() {
  const groups = [
    { t: "Frontend",  items: ["React", "Vite", "Tailwind", "Recharts"] },
    { t: "Backend",   items: ["FastAPI", "Uvicorn", "Pydantic", "JWT Auth"] },
    { t: "ML",        items: ["XGBoost", "Random Forest", "Isolation Forest", "SHAP"] },
    { t: "Storage",   items: ["SQLite", "PostgreSQL", "Pandas", "NumPy"] },
  ];
  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <div className="mx-auto max-w-2xl text-center">
        <div className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Tech Stack</div>
        <h2 className="mt-3 font-display text-4xl font-bold tracking-tight">Production-grade tooling</h2>
      </div>
      <div className="mt-14 grid gap-4 md:grid-cols-4">
        {groups.map((g) => (
          <div key={g.t} className="glass rounded-2xl p-6">
            <div className="text-xs font-semibold uppercase tracking-widest text-primary">{g.t}</div>
            <ul className="mt-4 space-y-2 font-mono text-sm">
              {g.items.map((i) => <li key={i} className="text-muted-foreground">▸ {i}</li>)}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

function Benefits() {
  const b = [
    "Cut unplanned downtime by predicting failures days in advance",
    "Extend asset life with data-driven maintenance scheduling",
    "Reduce maintenance costs by avoiding emergency repairs",
    "Improve operator safety with early anomaly warnings",
    "Standardize fleet-wide health monitoring in one dashboard",
    "Export reports and history for audits and compliance",
  ];
  return (
    <section className="border-t border-border/60 bg-card/20">
      <div className="mx-auto max-w-7xl px-6 py-24">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Why it matters</div>
            <h2 className="mt-3 font-display text-4xl font-bold tracking-tight">From reactive to predictive maintenance</h2>
            <p className="mt-4 text-muted-foreground">Industrial equipment failure costs the global economy over $50 billion annually. MachineGuard AI gives plant managers, reliability engineers, and operators the foresight to act before equipment breaks.</p>
          </div>
          <ul className="space-y-3">
            {b.map((t) => (
              <li key={t} className="flex items-start gap-3 glass rounded-xl p-4">
                <div className="mt-0.5 grid h-6 w-6 flex-shrink-0 place-items-center rounded-full bg-primary/20 text-primary">✓</div>
                <span className="text-sm">{t}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <div className="glass-strong relative overflow-hidden rounded-3xl p-12 text-center shadow-elevated">
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="absolute -top-24 left-1/2 h-48 w-96 -translate-x-1/2 rounded-full bg-primary/20 blur-3xl" />
        <div className="relative">
          <h2 className="font-display text-4xl font-bold tracking-tight md:text-5xl">Ready to predict failures?</h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">Try the live demo with the sample machine, or upload your own sensor CSV.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/predict" className="rounded-lg bg-gradient-to-r from-primary to-accent px-6 py-3 font-medium text-primary-foreground shadow-glow transition hover:opacity-90">Run a prediction</Link>
            <Link to="/dashboard" className="rounded-lg border border-border bg-secondary/40 px-6 py-3 font-medium transition hover:bg-secondary">Open dashboard</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
