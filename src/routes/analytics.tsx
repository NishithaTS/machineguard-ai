import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { Shell, PageHeader } from "@/components/site/Shell";
import { ChartCard, tooltipStyle } from "./dashboard";
import { generateFleet, generateTrend, predict } from "@/lib/predict";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, ResponsiveContainer, Scatter, ScatterChart, Tooltip, XAxis, YAxis, ZAxis } from "recharts";

export const Route = createFileRoute("/analytics")({
  head: () => ({ meta: [{ title: "Analytics — MachineGuard AI" }, { name: "description", content: "Advanced charts and trends across the equipment fleet." }] }),
  component: AnalyticsPage,
});

function AnalyticsPage() {
  const { trend, rulData, scatter, risk7d } = useMemo(() => {
    const fleet = generateFleet(24);
    const results = fleet.map((m, i) => ({ ...predict(m), idx: i, vibration: m.vibration, temperature: m.temperature }));
    const trend = generateTrend(24);
    const rulData = results
      .sort((a, b) => a.remaining_useful_life - b.remaining_useful_life)
      .slice(0, 10)
      .map((r) => ({ machine: r.machine_id, rul: r.remaining_useful_life, health: r.health_score }));
    const scatter = results.map((r) => ({
      x: r.vibration, y: r.temperature, z: r.health_score,
      color: r.failure_risk === "High" ? "var(--destructive)" : r.failure_risk === "Medium" ? "var(--warning)" : "var(--success)",
    }));
    const risk7d = Array.from({ length: 7 }, (_, i) => ({
      day: `Day ${i + 1}`,
      Low:    8 + Math.round(Math.sin(i / 1.2) * 2),
      Medium: 5 + Math.round(Math.cos(i / 1.5) * 2),
      High:   3 + Math.round(Math.sin(i / 0.8) * 2),
    }));
    return { trend, rulData, scatter, risk7d };
  }, []);

  return (
    <Shell>
      <PageHeader eyebrow="Insights" title="Advanced Analytics" description="Cross-machine trends, RUL ranking, and sensor correlations." />
      <div className="mx-auto grid max-w-7xl gap-4 px-6 pb-12 lg:grid-cols-2">

        <ChartCard title="Risk Distribution — Last 7 Days">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={risk7d}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="day" stroke="var(--muted-foreground)" fontSize={11} />
              <YAxis stroke="var(--muted-foreground)" fontSize={11} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="Low"    stackId="a" fill="var(--success)" />
              <Bar dataKey="Medium" stackId="a" fill="var(--warning)" />
              <Bar dataKey="High"   stackId="a" fill="var(--destructive)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Top 10 Machines by Lowest RUL">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={rulData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis type="number" stroke="var(--muted-foreground)" fontSize={11} />
              <YAxis dataKey="machine" type="category" stroke="var(--muted-foreground)" fontSize={11} width={60} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="rul" radius={[0, 4, 4, 0]}>
                {rulData.map((r) => (
                  <Cell key={r.machine} fill={r.rul < 200 ? "var(--destructive)" : r.rul < 500 ? "var(--warning)" : "var(--primary)"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Sensor Trends (24h)" className="lg:col-span-2">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trend}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="hour" stroke="var(--muted-foreground)" fontSize={11} />
              <YAxis stroke="var(--muted-foreground)" fontSize={11} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Line type="monotone" dataKey="temperature" stroke="var(--chart-1)" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="vibration"   stroke="var(--chart-2)" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="pressure"    stroke="var(--chart-3)" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="rpm"         stroke="var(--chart-4)" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Vibration vs Temperature (size = health)" className="lg:col-span-2">
          <ResponsiveContainer width="100%" height={300}>
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="x" name="Vibration" unit=" mm/s" stroke="var(--muted-foreground)" fontSize={11} />
              <YAxis dataKey="y" name="Temperature" unit="°C" stroke="var(--muted-foreground)" fontSize={11} />
              <ZAxis dataKey="z" range={[60, 400]} />
              <Tooltip contentStyle={tooltipStyle} cursor={{ strokeDasharray: "3 3" }} />
              <Scatter data={scatter}>
                {scatter.map((s, i) => <Cell key={i} fill={s.color} fillOpacity={0.7} />)}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </Shell>
  );
}
