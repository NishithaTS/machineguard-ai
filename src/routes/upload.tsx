import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import Papa from "papaparse";
import { Shell, PageHeader } from "@/components/site/Shell";
import { AlertBadge, RiskBadge } from "@/components/site/Badges";
import { predict, type PredictionResult, type SensorInput } from "@/lib/predict";
import { addPrediction } from "@/lib/store";
import { Download, FileUp, FileSpreadsheet, Trash2 } from "lucide-react";

export const Route = createFileRoute("/upload")({
  head: () => ({ meta: [{ title: "CSV Batch Upload — MachineGuard AI" }, { name: "description", content: "Drop a sensor CSV to get batch predictions across your fleet." }] }),
  component: UploadPage,
});

const REQUIRED = ["machine_id","temperature","vibration","pressure","rpm","voltage","current","torque","humidity","operating_hours"] as const;

function UploadPage() {
  const [rows, setRows] = useState<SensorInput[]>([]);
  const [results, setResults] = useState<PredictionResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [drag, setDrag] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  const parse = (file: File) => {
    setError(null);
    setFileName(file.name);
    Papa.parse(file, {
      header: true, skipEmptyLines: true,
      complete: (res) => {
        const data = res.data as Record<string, string>[];
        const missing = REQUIRED.filter((c) => !(c in (data[0] || {})));
        if (missing.length) {
          setError(`Missing columns: ${missing.join(", ")}`);
          setRows([]); setResults([]);
          return;
        }
        const parsed: SensorInput[] = data.map((r) => ({
          machine_id: r.machine_id,
          temperature: +r.temperature, vibration: +r.vibration, pressure: +r.pressure,
          rpm: +r.rpm, voltage: +r.voltage, current: +r.current, torque: +r.torque,
          humidity: +r.humidity, operating_hours: +r.operating_hours,
        }));
        const preds = parsed.map(predict);
        setRows(parsed);
        setResults(preds);
        addPrediction(preds);
      },
    });
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault(); setDrag(false);
    const f = e.dataTransfer.files[0]; if (f) parse(f);
  };

  const downloadCsv = () => {
    if (!results.length) return;
    const csv = Papa.unparse(results);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "predictions.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  const downloadSample = () => {
    const sample = [
      "machine_id,temperature,vibration,pressure,rpm,voltage,current,torque,humidity,operating_hours",
      "M-101,82.5,0.76,31.2,1480,230,12.5,45.8,55,4200",
      "M-102,65.0,0.35,28.5,1500,228,8.0,38.0,50,2100",
      "M-103,90.1,1.10,33.0,1520,232,14.0,52.0,60,6500",
    ].join("\n");
    const blob = new Blob([sample], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "sample-sensors.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  const reset = () => { setRows([]); setResults([]); setFileName(null); setError(null); };

  return (
    <Shell>
      <PageHeader eyebrow="Batch inference" title="CSV Sensor Upload" description="Drop a CSV with sensor readings and instantly score every row." />
      <div className="mx-auto max-w-7xl space-y-6 px-6 pb-12">

        <div
          onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
          onDragLeave={() => setDrag(false)}
          onDrop={onDrop}
          className={`glass rounded-2xl border-2 border-dashed p-10 text-center transition ${drag ? "border-primary bg-primary/5" : "border-border/60"}`}
        >
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 text-primary">
            <FileUp className="h-7 w-7" />
          </div>
          <div className="mt-4 font-display text-lg font-semibold">Drag & drop your sensor CSV here</div>
          <div className="mt-1 text-sm text-muted-foreground">or click below to browse. Required columns: {REQUIRED.join(", ")}</div>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <label className="cursor-pointer rounded-lg bg-gradient-to-r from-primary to-accent px-5 py-2 text-sm font-medium text-primary-foreground shadow-glow transition hover:opacity-90">
              Browse file
              <input type="file" accept=".csv" className="hidden" onChange={(e) => e.target.files?.[0] && parse(e.target.files[0])} />
            </label>
            <button onClick={downloadSample} className="rounded-lg border border-border bg-secondary/40 px-5 py-2 text-sm font-medium transition hover:bg-secondary">Download sample CSV</button>
          </div>
          {fileName && <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-secondary/60 px-3 py-1 text-xs"><FileSpreadsheet className="h-3.5 w-3.5" />{fileName} · {rows.length} rows</div>}
          {error && <div className="mt-4 inline-block rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-2 text-sm text-destructive">{error}</div>}
        </div>

        {results.length > 0 && (
          <>
            <div className="grid gap-4 md:grid-cols-4">
              <Stat label="Rows processed" value={results.length} />
              <Stat label="High risk" value={results.filter(r => r.failure_risk === "High").length} color="text-destructive" />
              <Stat label="Anomalies" value={results.filter(r => r.anomaly_status === "Anomaly").length} color="text-warning" />
              <Stat label="Critical alerts" value={results.filter(r => r.alert_level === "Critical").length} color="text-destructive" />
            </div>

            <div className="glass rounded-2xl p-5">
              <div className="mb-4 flex items-center justify-between">
                <div className="text-sm font-semibold">Predictions</div>
                <div className="flex gap-2">
                  <button onClick={reset} className="inline-flex items-center gap-1.5 rounded-md border border-border bg-secondary/40 px-3 py-1.5 text-xs hover:bg-secondary"><Trash2 className="h-3.5 w-3.5" /> Clear</button>
                  <button onClick={downloadCsv} className="inline-flex items-center gap-1.5 rounded-md bg-gradient-to-r from-primary to-accent px-3 py-1.5 text-xs font-medium text-primary-foreground"><Download className="h-3.5 w-3.5" /> Download CSV</button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border/60 text-left text-xs uppercase tracking-wider text-muted-foreground">
                      <th className="py-2 pr-4">Machine</th>
                      <th className="py-2 pr-4">Risk</th>
                      <th className="py-2 pr-4">Prob.</th>
                      <th className="py-2 pr-4">RUL (h)</th>
                      <th className="py-2 pr-4">Health</th>
                      <th className="py-2 pr-4">Anomaly</th>
                      <th className="py-2 pr-4">Alert</th>
                      <th className="py-2 pr-4">Recommendation</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((r) => (
                      <tr key={r.machine_id} className="border-b border-border/30 hover:bg-secondary/30">
                        <td className="py-2.5 pr-4 font-mono">{r.machine_id}</td>
                        <td className="py-2.5 pr-4"><RiskBadge risk={r.failure_risk} /></td>
                        <td className="py-2.5 pr-4 font-mono">{Math.round(r.failure_probability * 100)}%</td>
                        <td className="py-2.5 pr-4 font-mono">{r.remaining_useful_life}</td>
                        <td className="py-2.5 pr-4 font-mono">{r.health_score}</td>
                        <td className="py-2.5 pr-4">{r.anomaly_status}</td>
                        <td className="py-2.5 pr-4"><AlertBadge level={r.alert_level} /></td>
                        <td className="py-2.5 pr-4 text-xs text-muted-foreground">{r.maintenance_recommendation}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </Shell>
  );
}

function Stat({ label, value, color = "text-foreground" }: { label: string; value: number; color?: string }) {
  return (
    <div className="glass rounded-2xl p-5">
      <div className={`font-display text-3xl font-bold tabular-nums ${color}`}>{value}</div>
      <div className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">{label}</div>
    </div>
  );
}
