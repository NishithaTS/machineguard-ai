import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Cpu } from "lucide-react";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Sign in — MachineGuard AI" }] }),
  component: LoginPage,
});

function LoginPage() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");

  return (
    <div className="grid min-h-screen place-items-center bg-hero px-6">
      <div className="w-full max-w-md">
        <Link to="/" className="mb-8 flex items-center justify-center gap-2">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-primary to-accent shadow-glow"><Cpu className="h-5 w-5 text-primary-foreground" /></div>
          <span className="font-display text-xl font-bold">MachineGuard <span className="gradient-text">AI</span></span>
        </Link>
        <div className="glass-strong rounded-2xl p-8 shadow-elevated">
          <h1 className="font-display text-2xl font-bold">Welcome back</h1>
          <p className="mt-1 text-sm text-muted-foreground">Sign in to your operations dashboard.</p>
          <form onSubmit={(e) => { e.preventDefault(); nav({ to: "/dashboard" }); }} className="mt-6 space-y-4">
            <Field label="Email">
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="operator@plant.com" className={inputCls} />
            </Field>
            <Field label="Password">
              <input type="password" required value={pwd} onChange={(e) => setPwd(e.target.value)} placeholder="••••••••" className={inputCls} />
            </Field>
            <button className="w-full rounded-lg bg-gradient-to-r from-primary to-accent px-5 py-2.5 font-medium text-primary-foreground shadow-glow transition hover:opacity-90">Sign in</button>
          </form>
          <div className="mt-5 text-center text-sm text-muted-foreground">
            No account? <Link to="/register" className="text-primary hover:underline">Create one</Link>
          </div>
        </div>
        <div className="mt-4 text-center text-xs text-muted-foreground"><Link to="/" className="hover:text-primary">← Back to home</Link></div>
      </div>
    </div>
  );
}

const inputCls = "w-full rounded-lg border border-border bg-input/50 px-3 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary";
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block"><div className="mb-1.5 text-xs font-medium text-muted-foreground">{label}</div>{children}</label>;
}
