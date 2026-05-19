import { Link } from "@tanstack/react-router";
import { Cpu } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border/60">
      <div className="mx-auto grid max-w-7xl gap-8 px-6 py-12 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-primary to-accent">
              <Cpu className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-display font-bold">MachineGuard <span className="gradient-text">AI</span></span>
          </div>
          <p className="mt-3 max-w-xs text-sm text-muted-foreground">
            Predict industrial equipment failures before they happen. Built for the Industry 4.0 era.
          </p>
        </div>
        <div>
          <div className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Platform</div>
          <ul className="space-y-2 text-sm">
            <li><Link to="/dashboard" className="hover:text-primary">Dashboard</Link></li>
            <li><Link to="/predict" className="hover:text-primary">Single Prediction</Link></li>
            <li><Link to="/upload" className="hover:text-primary">Batch CSV</Link></li>
            <li><Link to="/analytics" className="hover:text-primary">Analytics</Link></li>
          </ul>
        </div>
        <div>
          <div className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Resources</div>
          <ul className="space-y-2 text-sm">
            <li><Link to="/about" className="hover:text-primary">About the project</Link></li>
            <li><Link to="/machines" className="hover:text-primary">Machine health</Link></li>
            <li><Link to="/alerts" className="hover:text-primary">Alerts</Link></li>
          </ul>
        </div>
        <div>
          <div className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Stack</div>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>React · Vite · Tailwind</li>
            <li>FastAPI · Python</li>
            <li>XGBoost · Isolation Forest</li>
            <li>SHAP · TensorFlow</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/60 py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} MachineGuard AI — Predict failures before they happen.
      </div>
    </footer>
  );
}
