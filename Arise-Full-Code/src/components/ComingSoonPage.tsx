import { Bot, Users } from "lucide-react";

interface ComingSoonPageProps {
  title: "Network" | "AI Assistant";
  description: string;
}

export default function ComingSoonPage({ title, description }: ComingSoonPageProps) {
  const Icon = title === "Network" ? Users : Bot;

  return (
    <div className="mx-auto flex min-h-[70vh] w-full max-w-2xl flex-col items-center justify-center px-6 py-16 text-center">
      <div className="relative mb-6 flex h-20 w-20 items-center justify-center rounded-2xl border border-accent/30 bg-accent/10 text-accent">
        <div className="absolute inset-0 rounded-2xl bg-accent/10 blur-xl" />
        <Icon size={32} className="relative" />
      </div>
      <p className="eyebrow mb-3">A new feature is taking shape</p>
      <h1 className="font-display text-2xl font-bold text-ink">{title}</h1>
      <p className="mt-3 max-w-md text-sm leading-6 text-ink-muted">{description}</p>
      <span className="mt-7 rounded-full border border-accent/25 bg-accent/10 px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-accent">
        Coming Soon
      </span>
    </div>
  );
}
