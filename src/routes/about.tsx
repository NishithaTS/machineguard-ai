import { createFileRoute } from "@tanstack/react-router";
import { Shell, PageHeader } from "@/components/site/Shell";
import { Brain, Cpu, Database, Factory, GitBranch, LineChart, Server, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({ meta: [{ title: "About — MachineGuard AI" }, { name: "description", content: "The problem, the AI pipeline, the ML models, and the industrial relevance behind MachineGuard AI." }] }),
  component: About,
});

function About() {
  return (
    <Shell>
      <PageHeader eyebrow="The project" title="About MachineGuard AI" description="A predictive maintenance platform for the Industry 4.0 era." />
      <div className="mx-auto max-w-5xl space-y-6 px-6 pb-12">

        <Section icon={Factory} title="Problem statement">
          Industrial equipment failure causes unplanned downtime, safety risks, and over $50B in annual losses globally.
          Traditional time-based maintenance is wasteful, and reactive repair is dangerous. Operators need a data-driven
          way to know <em>when</em> a machine will fail — before it does.
        </Section>

        <Section icon={Brain} title="AI pipeline">
          <ol className="space-y-2 text-sm">
            {[
              "Sensor Data — 9 signals per reading (temperature, vibration, pressure, RPM, voltage, current, torque, humidity, hours).",
              "Data Preprocessing — cleaning, normalization, outlier handling.",
              "Feature Engineering — derived features (deviation from nominal, rolling stats, stress indices).",
              "Model Training — XGBoost for risk, regressor for RUL, Isolation Forest for anomalies.",
              "Model Evaluation — held-out test, confusion matrix, RMSE for RUL.",
              "Saved Models — versioned artifacts in saved_models/.",
              "FastAPI Prediction Engine — low-latency inference behind a JWT-protected API.",
              "React Dashboard — operator-facing real-time visualization.",
              "Maintenance Alerts — Critical/Warning bands with recommendations.",
              "Monitoring & Retraining — feedback loop to keep models fresh.",
            ].map((s, i) => (
              <li key={i} className="flex gap-3"><span className="font-mono text-xs text-primary">{String(i + 1).padStart(2, "0")}</span><span>{s}</span></li>
            ))}
          </ol>
        </Section>

        <div className="grid gap-4 md:grid-cols-3">
          <Card icon={GitBranch} title="Failure Risk" badge="XGBoost · Random Forest">
            Classifies machines into Low / Medium / High risk with calibrated probabilities.
          </Card>
          <Card icon={LineChart} title="Remaining Useful Life" badge="XGBoost Regressor · LSTM">
            Regresses operating hours remaining before predicted failure.
          </Card>
          <Card icon={ShieldCheck} title="Anomaly Detection" badge="Isolation Forest">
            Unsupervised detector flags sensor patterns outside the learned normal envelope.
          </Card>
        </div>

        <Section icon={Server} title="Tech stack">
          <div className="grid gap-4 md:grid-cols-2 text-sm">
            <Stack t="Frontend" items={["React 19", "Vite", "Tailwind CSS", "Recharts", "TanStack Router"]} />
            <Stack t="Backend"  items={["FastAPI", "Uvicorn", "Pydantic", "JWT auth"]} />
            <Stack t="ML"       items={["Scikit-learn", "XGBoost", "TensorFlow (optional)", "SHAP"]} />
            <Stack t="Storage"  items={["SQLite (default)", "PostgreSQL (optional)", "Pandas", "NumPy"]} />
          </div>
        </Section>

        <Section icon={Cpu} title="Industrial relevance">
          MachineGuard AI is designed for plant managers, reliability engineers, and operations teams across manufacturing,
          energy, oil & gas, and logistics. By moving from reactive to predictive maintenance, organizations can extend
          asset lifetime, reduce unplanned downtime, lower MRO spend, and improve workforce safety.
        </Section>

        <Section icon={Database} title="Project structure">
          <pre className="overflow-x-auto rounded-lg border border-border/60 bg-card/40 p-4 font-mono text-xs leading-relaxed">{`machineguard-ai/
├── frontend/        # React + Vite + Tailwind
├── backend/         # FastAPI + JWT auth
├── ml/              # Training notebooks, pipelines
├── data/            # Raw + processed sensor data
├── saved_models/    # Versioned model artifacts
├── docker-compose.yml
└── README.md`}</pre>
        </Section>
      </div>
    </Shell>
  );
}

function Section({ icon: Icon, title, children }: { icon: any; title: string; children: React.ReactNode }) {
  return (
    <section className="glass rounded-2xl p-6">
      <div className="mb-3 flex items-center gap-2">
        <div className="grid h-8 w-8 place-items-center rounded-lg bg-primary/15 text-primary"><Icon className="h-4 w-4" /></div>
        <h2 className="font-display text-xl font-semibold">{title}</h2>
      </div>
      <div className="text-sm text-muted-foreground leading-relaxed">{children}</div>
    </section>
  );
}

function Card({ icon: Icon, title, badge, children }: { icon: any; title: string; badge: string; children: React.ReactNode }) {
  return (
    <div className="glass rounded-2xl p-5">
      <Icon className="h-5 w-5 text-primary" />
      <div className="mt-3 font-display text-base font-semibold">{title}</div>
      <div className="mt-1 inline-block rounded-full bg-secondary px-2 py-0.5 font-mono text-[10px] text-muted-foreground">{badge}</div>
      <p className="mt-3 text-sm text-muted-foreground">{children}</p>
    </div>
  );
}

function Stack({ t, items }: { t: string; items: string[] }) {
  return (
    <div className="rounded-lg border border-border/60 bg-card/40 p-4">
      <div className="text-xs font-semibold uppercase tracking-widest text-primary">{t}</div>
      <ul className="mt-2 space-y-1 font-mono text-xs text-muted-foreground">{items.map((i) => <li key={i}>▸ {i}</li>)}</ul>
    </div>
  );
}
