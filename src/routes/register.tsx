import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Cpu } from "lucide-react";

export const Route = createFileRoute("/register")({
  head: () => ({ meta: [{ title: "Create account — MachineGuard AI" }] }),
  component: RegisterPage,
});

function RegisterPage() {
  const nav = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", pwd: "" });

  return (
    <div className="grid min-h-screen place-items-center bg-hero px-6">
      <div className="w-full max-w-md">
        <Link to="/" className="mb-8 flex items-center justify-center gap-2">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-primary to-accent shadow-glow"><Cpu className="h-5 w-5 text-primary-foreground" /></div>
          <span className="font-display text-xl font-bold">MachineGuard <span className="gradient-text">AI</span></span>
        </Link>
        <div className="glass-strong rounded-2xl p-8 shadow-elevated">
          <h1 className="font-display text-2xl font-bold">Create your account</h1>
          <p className="mt-1 text-sm text-muted-foreground">Start monitoring your fleet in minutes.</p>
          <form onSubmit={(e) => { e.preventDefault(); nav({ to: "/dashboard" }); }} className="mt-6 space-y-4">
            <Field label="Full name"><input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputCls} placeholder="Jane Operator" /></Field>
            <Field label="Email"><input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputCls} placeholder="jane@plant.com" /></Field>
            <Field label="Password"><input type="password" required value={form.pwd} onChange={(e) => setForm({ ...form, pwd: e.target.value })} className={inputCls} placeholder="At least 8 characters" /></Field>
            <button className="w-full rounded-lg bg-gradient-to-r from-primary to-accent px-5 py-2.5 font-medium text-primary-foreground shadow-glow transition hover:opacity-90">Create account</button>
          </form>
          <div className="mt-5 text-center text-sm text-muted-foreground">
            Already have one? <Link to="/login" className="text-primary hover:underline">Sign in</Link>
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
