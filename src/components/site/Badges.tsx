import type { AlertLevel, AnomalyStatus, RiskLevel } from "@/lib/predict";

export function RiskBadge({ risk }: { risk: RiskLevel }) {
  const map = {
    Low:    "bg-success/15 text-success border-success/30",
    Medium: "bg-warning/15 text-warning border-warning/30",
    High:   "bg-destructive/15 text-destructive border-destructive/30",
  } as const;
  return <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${map[risk]}`}>
    <span className="h-1.5 w-1.5 rounded-full bg-current" />{risk}
  </span>;
}

export function AlertBadge({ level }: { level: AlertLevel }) {
  const map = {
    Normal:   "bg-success/15 text-success border-success/30",
    Warning:  "bg-warning/15 text-warning border-warning/30",
    Critical: "bg-destructive/15 text-destructive border-destructive/30",
  } as const;
  return <span className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${map[level]}`}>{level}</span>;
}

export function AnomalyBadge({ status }: { status: AnomalyStatus }) {
  return status === "Anomaly"
    ? <span className="rounded-full border border-destructive/30 bg-destructive/15 px-2.5 py-0.5 text-xs font-medium text-destructive">Anomaly</span>
    : <span className="rounded-full border border-border bg-secondary/60 px-2.5 py-0.5 text-xs font-medium text-muted-foreground">Normal</span>;
}

export function HealthBar({ score }: { score: number }) {
  const color = score >= 70 ? "var(--success)" : score >= 40 ? "var(--warning)" : "var(--destructive)";
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-24 overflow-hidden rounded-full bg-secondary">
        <div className="h-full rounded-full transition-all" style={{ width: `${score}%`, background: color }} />
      </div>
      <span className="font-mono text-xs tabular-nums text-muted-foreground">{score}</span>
    </div>
  );
}
