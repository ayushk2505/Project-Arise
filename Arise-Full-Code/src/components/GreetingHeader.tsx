function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 18) return "Good Afternoon";
  return "Good Evening";
}

interface GreetingHeaderProps {
  name: string;
}

export default function GreetingHeader({ name }: GreetingHeaderProps) {
  return (
    <div>
      <p className="eyebrow">{getGreeting()},</p>
      <h1 className="font-display text-3xl font-bold text-ink">{name.toUpperCase()}</h1>
      <div className="mt-2 flex items-center gap-2">
        <span className="text-[10px] uppercase tracking-wide text-ink-muted">System Status</span>
        <span className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-400">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgb(52,211,153)]" />
          Active
        </span>
      </div>
    </div>
  );
}
