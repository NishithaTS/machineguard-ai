import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { Shell, PageHeader } from "@/components/site/Shell";
import { AlertBadge, RiskBadge } from "@/components/site/Badges";
import { generateFleet, predict } from "@/lib/predict";
import { AlertOctagon, AlertTriangle } from "lucide-react";

export const Route = createFileRoute("/alerts")({
  head: () => ({ meta: [{ title: "Alerts — MachineGuard AI" }, { name: "description", content: "Critical and warning maintenance alerts across the monitored fleet." }] }),
  component: AlertsPage,
});

function AlertsPage() {
  const alerts = useMemo(() => generateFleet(24).map(predict).filter(r => r.alert_level !== "Normal"), []);
  const critical = alerts.filter(a => a.alert_level === "Critical");
  const warning  = alerts.filter(a => a.alert_level === "Warning");

  return (
    <Shell>
      <PageHeader eyebrow="Monitoring" title="Active Alerts" description="Machines requiring immediate or scheduled attention." />
      <div className="mx-auto max-w-7xl space-y-6 px-6 pb-12">
        <Group title="Critical" icon={AlertOctagon} items={critical} tone="destructive" />
        <Group title="Warning"  icon={AlertTriangle} items={warning}  tone="warning" />
      </div>
    </Shell>
  );
}

function Group({ title, icon: Icon, items, tone }: { title: string; icon: any; items: any[]; tone: "destructive" | "warning" }) {
  const toneCls = tone === "destructive" ? "text-destructive border-destructive/30 bg-destructive/10" : "text-warning border-warning/30 bg-warning/10";
  return (
    <section>
      <div className="mb-3 flex items-center gap-2">
        <div className={`grid h-8 w-8 place-items-center rounded-lg border ${toneCls}`}><Icon className="h-4 w-4" /></div>
        <div className="font-display text-lg font-semibold">{title}</div>
        <span className="rounded-full bg-secondary px-2 py-0.5 text-xs text-muted-foreground">{items.length}</span>
      </div>
      {items.length === 0 ? (
        <div className="glass rounded-2xl p-6 text-sm text-muted-foreground">No {title.toLowerCase()} alerts.</div>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {items.map((a) => (
            <div key={a.machine_id} className="glass rounded-2xl p-5">
              <div className="flex items-center justify-between">
                <div className="font-mono text-base font-semibold">{a.machine_id}</div>
                <AlertBadge level={a.alert_level} />
              </div>
              <div className="mt-3 flex items-center gap-2 text-xs">
                <RiskBadge risk={a.failure_risk} />
                <span className="text-muted-foreground">· RUL <span className="font-mono">{a.remaining_useful_life}h</span></span>
                <span className="text-muted-foreground">· Health <span className="font-mono">{a.health_score}</span></span>
              </div>
              <div className="mt-3 rounded-lg border border-border/60 bg-secondary/30 p-3 text-sm">
                {a.maintenance_recommendation}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
