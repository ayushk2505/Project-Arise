import type { ElementType } from "react";
import { Flame, Zap, Crown as CrownIcon, Trophy, Swords } from "lucide-react";

interface StatsStripProps {
  streak: number;
  questsCompletedToday: number;
  totalXp: number;
  achievementsUnlocked: number;
}

function Stat({ icon: Icon, value, label }: { icon: ElementType; value: string | number; label: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <Icon size={16} className="text-ink-muted" />
      <div className="leading-tight">
        <p className="font-mono-num text-base font-bold text-ink">{value}</p>
        <p className="text-[10px] uppercase tracking-wide text-ink-muted">{label}</p>
      </div>
    </div>
  );
}

export default function StatsStrip({ streak, questsCompletedToday, totalXp, achievementsUnlocked }: StatsStripProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-6 border-t border-border pt-4">
      <Stat icon={Flame} value={streak} label="Day Streak" />
      <Stat icon={Zap} value={questsCompletedToday} label="Protocols Today" />
      <Stat icon={CrownIcon} value={totalXp.toLocaleString()} label="Total XP" />
      <Stat icon={Trophy} value={achievementsUnlocked} label="Achievements" />
      <Stat icon={Swords} value={0} label="Bosses Defeated" />
    </div>
  );
}
