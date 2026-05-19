import { Link } from "@tanstack/react-router";
import { Cpu } from "lucide-react";

const nav = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/predict", label: "Predict" },
  { to: "/upload", label: "CSV Upload" },
  { to: "/machines", label: "Machines" },
  { to: "/alerts", label: "Alerts" },
  { to: "/analytics", label: "Analytics" },
  { to: "/history", label: "History" },
  { to: "/about", label: "About" },
] as const;

export function Header() {
  return (
    <header className="sticky top-0 z-50 glass-strong">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
        <Link to="/" className="flex items-center gap-2">
          <div className="relative grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-primary to-accent shadow-glow">
            <Cpu className="h-5 w-5 text-primary-foreground" />
          </div>
          <div className="leading-tight">
            <div className="font-display text-base font-bold tracking-tight">MachineGuard <span className="gradient-text">AI</span></div>
            <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Predictive Maintenance</div>
          </div>
        </Link>
        <nav className="hidden items-center gap-1 lg:flex">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="rounded-md px-3 py-1.5 text-sm text-muted-foreground transition hover:bg-secondary/60 hover:text-foreground"
              activeProps={{ className: "rounded-md px-3 py-1.5 text-sm text-primary bg-secondary/80" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link to="/login" className="hidden rounded-md px-3 py-1.5 text-sm text-muted-foreground transition hover:text-foreground md:inline">Sign in</Link>
          <Link
            to="/register"
            className="rounded-md bg-gradient-to-r from-primary to-accent px-4 py-1.5 text-sm font-medium text-primary-foreground shadow-glow transition hover:opacity-90"
          >
            Get started
          </Link>
        </div>
      </div>
    </header>
  );
}
