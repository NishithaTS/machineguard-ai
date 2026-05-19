import { Header } from "./Header";
import { Footer } from "./Footer";

export function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

export function PageHeader({ eyebrow, title, description }: { eyebrow?: string; title: string; description?: string }) {
  return (
    <div className="mx-auto max-w-7xl px-6 pt-10 pb-6">
      {eyebrow && <div className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary">{eyebrow}</div>}
      <h1 className="font-display text-3xl font-bold tracking-tight md:text-4xl">{title}</h1>
      {description && <p className="mt-2 max-w-2xl text-muted-foreground">{description}</p>}
    </div>
  );
}
