import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Shell, PageHeader } from "@/components/site/Shell";
import { AlertBadge, AnomalyBadge, RiskBadge } from "@/components/site/Badges";
import { clearHistory, getHistory } from "@/lib/store";
import type { PredictionResult } from "@/lib/predict";
import { Trash2 } from "lucide-react";

export const Route = createFileRoute("/history")({
  head: () => ({ meta: [{ title: "Prediction History — MachineGuard AI" }, { name: "description", content: "Browse all historical predictions and outcomes." }] }),
  component: HistoryPage,
});

function HistoryPage() {
  const [items, setItems] = useState<PredictionResult[]>([]);
  useEffect(() => { setItems(getHistory()); }, []);

  const clear = () => { clearHistory(); setItems([]); };

  return (
    <Shell>
      <PageHeader eyebrow="Log" title="Prediction History" description="Every inference run from this browser is stored locally." />
      <div className="mx-auto max-w-7xl px-6 pb-12">
        <div className="glass rounded-2xl p-5">
          <div className="mb-4 flex items-center justify-between">
            <div className="text-sm text-muted-foreground">{items.length} record{items.length === 1 ? "" : "s"}</div>
            {items.length > 0 && (
              <button onClick={clear} className="inline-flex items-center gap-1.5 rounded-md border border-border bg-secondary/40 px-3 py-1.5 text-xs hover:bg-secondary"><Trash2 className="h-3.5 w-3.5" /> Clear all</button>
            )}
          </div>
          {items.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border/60 p-10 text-center text-sm text-muted-foreground">
              No predictions yet. Run one from the <span className="text-primary">Predict</span> or <span className="text-primary">CSV Upload</span> pages.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/60 text-left text-xs uppercase tracking-wider text-muted-foreground">
                    <th className="py-2 pr-4">Time</th>
                    <th className="py-2 pr-4">Machine</th>
                    <th className="py-2 pr-4">Risk</th>
                    <th className="py-2 pr-4">Prob.</th>
                    <th className="py-2 pr-4">RUL</th>
                    <th className="py-2 pr-4">Health</th>
                    <th className="py-2 pr-4">Anomaly</th>
                    <th className="py-2 pr-4">Alert</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((r, i) => (
                    <tr key={i} className="border-b border-border/30 hover:bg-secondary/30">
                      <td className="py-2.5 pr-4 font-mono text-xs text-muted-foreground">{new Date(r.timestamp).toLocaleString()}</td>
                      <td className="py-2.5 pr-4 font-mono">{r.machine_id}</td>
                      <td className="py-2.5 pr-4"><RiskBadge risk={r.failure_risk} /></td>
                      <td className="py-2.5 pr-4 font-mono">{Math.round(r.failure_probability * 100)}%</td>
                      <td className="py-2.5 pr-4 font-mono">{r.remaining_useful_life}h</td>
                      <td className="py-2.5 pr-4 font-mono">{r.health_score}</td>
                      <td className="py-2.5 pr-4"><AnomalyBadge status={r.anomaly_status} /></td>
                      <td className="py-2.5 pr-4"><AlertBadge level={r.alert_level} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </Shell>
  );
}
