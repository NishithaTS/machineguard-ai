import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { Shell, PageHeader } from "@/components/site/Shell";
import { AlertBadge, HealthBar, RiskBadge } from "@/components/site/Badges";
import { generateFleet, generateTrend, predict } from "@/lib/predict";
import { Activity, AlertTriangle, Cpu, Gauge, HeartPulse } from "lucide-react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — MachineGuard AI" }, { name: "description", content: "Fleet-wide predictive maintenance dashboard with KPIs, trends, and alerts." }] }),
  component: Dashboard,
});

function Dashboard() {
  const { results, kpis, riskData, trend, anomalyData, healthTrend, alerts } = useMemo(() => {
    const fleet = generateFleet(24);
    const results = fleet.map(predict);
    const high = results.filter((r) => r.failure_risk === "High").length;
    const med  = results.filter((r) => r.failure_risk === "Medium").length;
    const low  = results.filter((r) => r.failure_risk === "Low").length;
    const anomalies = results.filter((r) => r.anomaly_status === "Anomaly").length;
    const avgHealth = Math.round(results.reduce((s, r) => s + r.health_score, 0) / results.length);
    const avgRUL    = Math.round(results.reduce((s, r) => s + r.remaining_useful_life, 0) / results.length);
    const active    = results.filter((r) => r.alert_level !== "Normal").length;

    const trend = generateTrend(24);
    const anomalyData = trend.map((t, i) => ({ hour: t.hour, anomalies: Math.max(0, Math.round(Math.sin(i / 3) * 2 + (i % 5 === 0 ? 3 : 1))) }));
    const healthTrend = trend.map((t, i) => ({ hour: t.hour, health: Math.round(70 + Math.sin(i / 4) * 12 + (i % 6 === 0 ? -8 : 2)) }));

    return {
      results,
      kpis: {
        total: results.length,
        high, avgHealth, avgRUL, active,
      },
      riskData: [
        { name: "Low", value: low, color: "var(--success)" },
        { name: "Medium", value: med, color: "var(--warning)" },
        { name: "High", value: high, color: "var(--destructive)" },
      ],
      trend,
      anomalyData,
      healthTrend,
      alerts: results.filter((r) => r.alert_level !== "Normal").slice(0, 6),
    };
  }, []);

  return (
    <Shell>
      <PageHeader eyebrow="Fleet overview" title="Operations Dashboard" description="Real-time health, risk, and alerts across all monitored equipment." />
      <div className="mx-auto max-w-7xl px-6 pb-12 space-y-6">

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <Kpi icon={Cpu} label="Total Machines" value={kpis.total} accent="text-primary" />
          <Kpi icon={AlertTriangle} label="High Risk" value={kpis.high} accent="text-destructive" />
          <Kpi icon={HeartPulse} label="Avg Health" value={kpis.avgHealth} suffix="/100" accent="text-accent" />
          <Kpi icon={Gauge} label="Avg RUL" value={kpis.avgRUL} suffix="h" accent="text-primary" />
          <Kpi icon={Activity} label="Active Alerts" value={kpis.active} accent="text-warning" />
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <ChartCard title="Failure Risk Distribution" className="lg:col-span-1">
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={riskData} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={4}>
                  {riskData.map((e) => <Cell key={e.name} fill={e.color} />)}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-2 flex justify-center gap-4 text-xs">
              {riskData.map((r) => (
                <div key={r.name} className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full" style={{ background: r.color }} />{r.name} · {r.value}</div>
              ))}
            </div>
          </ChartCard>

          <ChartCard title="Sensor Trend (last 24h)" className="lg:col-span-2">
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={trend}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="hour" stroke="var(--muted-foreground)" fontSize={11} />
                <YAxis stroke="var(--muted-foreground)" fontSize={11} />
                <Tooltip contentStyle={tooltipStyle} />
                <Line type="monotone" dataKey="temperature" stroke="var(--chart-1)" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="vibration" stroke="var(--chart-2)" strokeWidth={2} dot={false} yAxisId={0} />
                <Line type="monotone" dataKey="pressure" stroke="var(--chart-3)" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <ChartCard title="Machine Health Trend">
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={healthTrend}>
                <defs>
                  <linearGradient id="hg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="hour" stroke="var(--muted-foreground)" fontSize={11} />
                <YAxis stroke="var(--muted-foreground)" fontSize={11} domain={[0, 100]} />
                <Tooltip contentStyle={tooltipStyle} />
                <Area type="monotone" dataKey="health" stroke="var(--primary)" strokeWidth={2} fill="url(#hg)" />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Anomaly Counts">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={anomalyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="hour" stroke="var(--muted-foreground)" fontSize={11} />
                <YAxis stroke="var(--muted-foreground)" fontSize={11} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="anomalies" fill="var(--chart-2)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <Panel title="Recent Alerts" action={<Link to="/alerts" className="text-xs text-primary hover:underline">View all →</Link>}>
            <div className="divide-y divide-border/60">
              {alerts.map((a) => (
                <div key={a.machine_id} className="flex items-center justify-between py-3">
                  <div>
                    <div className="font-mono text-sm font-medium">{a.machine_id}</div>
                    <div className="text-xs text-muted-foreground">{a.maintenance_recommendation}</div>
                  </div>
                  <AlertBadge level={a.alert_level} />
                </div>
              ))}
            </div>
          </Panel>

          <Panel title="Machine Status Overview" action={<Link to="/machines" className="text-xs text-primary hover:underline">All machines →</Link>}>
            <div className="space-y-2">
              {results.slice(0, 7).map((r) => (
                <div key={r.machine_id} className="flex items-center justify-between rounded-lg border border-border/40 bg-secondary/30 px-3 py-2">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm">{r.machine_id}</span>
                    <RiskBadge risk={r.failure_risk} />
                  </div>
                  <HealthBar score={r.health_score} />
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </div>
    </Shell>
  );
}

export const tooltipStyle = {
  background: "oklch(0.22 0.05 265 / 0.95)",
  border: "1px solid var(--border)",
  borderRadius: "8px",
  fontSize: "12px",
} as const;

function Kpi({ icon: Icon, label, value, suffix, accent }: { icon: any; label: string; value: number; suffix?: string; accent: string }) {
  return (
    <div className="glass rounded-2xl p-5">
      <div className="flex items-start justify-between">
        <div className={`grid h-9 w-9 place-items-center rounded-lg bg-secondary/60 ${accent}`}><Icon className="h-4 w-4" /></div>
      </div>
      <div className="mt-3 font-display text-3xl font-bold tabular-nums">{value}<span className="text-base font-normal text-muted-foreground">{suffix}</span></div>
      <div className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">{label}</div>
    </div>
  );
}

export function ChartCard({ title, children, className = "" }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`glass rounded-2xl p-5 ${className}`}>
      <div className="mb-3 text-sm font-semibold">{title}</div>
      {children}
    </div>
  );
}

export function Panel({ title, action, children }: { title: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="glass rounded-2xl p-5">
      <div className="mb-3 flex items-center justify-between">
        <div className="text-sm font-semibold">{title}</div>
        {action}
      </div>
      {children}
    </div>
  );
}
