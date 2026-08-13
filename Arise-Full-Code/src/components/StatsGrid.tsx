import type { ElementType } from "react";
import { Flame, CheckCircle2, TrendingUp, Trophy, Target, Clock } from "lucide-react";
import type { StatsSummary } from "../types";

interface StatsGridProps {
  stats: StatsSummary;
}

function StatCard({
  icon: Icon,
  value,
  label,
}: {
  icon: ElementType;
  value: string | number;
  label: string;
}) {
  return (
    <div className="panel flex items-center gap-3 px-4 py-3.5">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
        <Icon size={17} />
      </div>
      <div className="min-w-0 leading-tight">
        <p className="truncate font-display text-lg font-bold text-ink">{value}</p>
        <p className="truncate text-[11px] text-ink-muted">{label}</p>
      </div>
    </div>
  );
}

export default function StatsGrid({ stats }: StatsGridProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      <StatCard icon={Flame} value={stats.currentStreak} label="Day Streak" />
      <StatCard icon={CheckCircle2} value={stats.totalQuestsCompleted} label="Quests Completed" />
      <StatCard icon={TrendingUp} value={`${stats.dailyCompletionRate}%`} label="Today's Rate" />
      <StatCard icon={Target} value={`${stats.weeklyCompletionRate}%`} label="Weekly Rate" />
      <StatCard icon={Trophy} value={stats.achievementCount} label="Achievements" />
      <StatCard icon={Clock} value={stats.longestStreak} label="Longest Streak" />
    </div>
  );
}
