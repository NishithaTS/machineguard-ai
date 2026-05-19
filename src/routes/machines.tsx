import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Shell, PageHeader } from "@/components/site/Shell";
import { AnomalyBadge, HealthBar, RiskBadge } from "@/components/site/Badges";
import { generateFleet, predict } from "@/lib/predict";
import { Search } from "lucide-react";

export const Route = createFileRoute("/machines")({
  head: () => ({ meta: [{ title: "Machine Health — MachineGuard AI" }, { name: "description", content: "Browse and filter health status for every monitored machine." }] }),
  component: MachinesPage,
});

function MachinesPage() {
  const machines = useMemo(() => {
    const fleet = generateFleet(24);
    return fleet.map((m) => ({ ...m, ...predict(m) }));
  }, []);
  const [risk, setRisk] = useState<string>("All");
  const [anomaly, setAnomaly] = useState<string>("All");
  const [q, setQ] = useState("");

  const filtered = machines.filter((m) =>
    (risk === "All" || m.failure_risk === risk) &&
    (anomaly === "All" || m.anomaly_status === anomaly) &&
    (q === "" || m.machine_id.toLowerCase().includes(q.toLowerCase()) || m.type.toLowerCase().includes(q.toLowerCase()))
  );

  return (
    <Shell>
      <PageHeader eyebrow="Fleet" title="Machine Health" description="All monitored equipment with real-time risk and anomaly status." />
      <div className="mx-auto max-w-7xl space-y-4 px-6 pb-12">
        <div className="glass flex flex-wrap items-center gap-3 rounded-2xl p-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input placeholder="Search machine ID or type…" value={q} onChange={(e) => setQ(e.target.value)} className="w-full rounded-lg border border-border bg-input/50 py-2 pl-10 pr-3 text-sm focus:border-primary focus:outline-none" />
          </div>
          <Select label="Risk" value={risk} onChange={setRisk} options={["All","Low","Medium","High"]} />
          <Select label="Anomaly" value={anomaly} onChange={setAnomaly} options={["All","Normal","Anomaly"]} />
          <div className="text-xs text-muted-foreground">Showing {filtered.length} / {machines.length}</div>
        </div>

        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((m) => (
            <div key={m.machine_id} className="glass rounded-2xl p-5 transition hover:border-primary/40">
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-mono text-base font-semibold">{m.machine_id}</div>
                  <div className="text-xs text-muted-foreground">{m.type}</div>
                </div>
                <RiskBadge risk={m.failure_risk} />
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                <Mini label="Temp" v={`${m.temperature}°`} />
                <Mini label="Vib"  v={`${m.vibration}`} />
                <Mini label="RPM"  v={`${m.rpm}`} />
              </div>
              <div className="mt-4 flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Health</span>
                <HealthBar score={m.health_score} />
              </div>
              <div className="mt-2 flex items-center justify-between text-xs">
                <span className="text-muted-foreground">RUL</span>
                <span className="font-mono">{m.remaining_useful_life}h</span>
              </div>
              <div className="mt-2 flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Anomaly</span>
                <AnomalyBadge status={m.anomaly_status} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </Shell>
  );
}

function Select({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <label className="flex items-center gap-2 text-xs text-muted-foreground">
      {label}:
      <select value={value} onChange={(e) => onChange(e.target.value)} className="rounded-md border border-border bg-input/50 px-2 py-1.5 text-foreground focus:border-primary focus:outline-none">
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </label>
  );
}

function Mini({ label, v }: { label: string; v: string }) {
  return (
    <div className="rounded-md border border-border/60 bg-secondary/30 py-1.5">
      <div className="font-mono text-sm font-semibold">{v}</div>
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
    </div>
  );
}
