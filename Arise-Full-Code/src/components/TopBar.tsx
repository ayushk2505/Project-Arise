import { Zap, Flame, UserRound } from "lucide-react";

interface TopBarProps {
  totalXp: number;
  streak: number;
  displayName: string;
  avatarPath: string | null;
  onOpenSettings: () => void;
}

export default function TopBar({ totalXp, streak, displayName, avatarPath, onOpenSettings }: TopBarProps) {
  return (
    <div className="flex items-center justify-end gap-6 px-8 py-5">
      <div className="flex items-center gap-1.5 text-ink-muted"><Zap size={13} className="text-accent-secondary" /><span className="font-mono-num text-xs text-ink">{totalXp.toLocaleString()}</span><span className="text-[10px] uppercase tracking-wide">XP</span></div>
      <div className="flex items-center gap-1.5 text-ink-muted"><Flame size={13} className="text-orange-400" /><span className="font-mono-num text-xs text-ink">{streak}</span><span className="text-[10px] uppercase tracking-wide">Day Streak</span></div>
      <button onClick={onOpenSettings} title="Open profile settings" className="group flex items-center gap-2 rounded-full border border-border bg-card/60 py-1 pl-1 pr-3 transition-all hover:scale-[1.02] hover:border-accent/50">
        {avatarPath ? <img src={`file://${avatarPath}`} alt="" className="h-9 w-9 rounded-full object-cover" /> : <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent-gradient text-void"><UserRound size={17} /></span>}
        <span className="max-w-24 truncate text-sm font-semibold text-ink">{displayName}</span>
      </button>
    </div>
  );
}