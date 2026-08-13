import { Swords } from "lucide-react";
import { getLevelInfo } from "../lib/xp";
import RankBadge from "./RankBadge";

interface UpcomingChallengeCardProps {
  totalXp: number;
}

export default function UpcomingChallengeCard({ totalXp }: UpcomingChallengeCardProps) {
  const info = getLevelInfo(totalXp);
  const { rank, nextRank, rankProgressPct } = info;

  if (!nextRank) {
    return (
      <div className="region">
        <p className="eyebrow mb-2">Upcoming Challenge</p>
        <p className="text-xs text-gold">Max rank achieved. Legend status.</p>
      </div>
    );
  }

  const xpRemaining = Math.max(0, nextRank.xpRequired - totalXp);

  return (
    <div className="region">
      <p className="eyebrow mb-2">Upcoming Challenge</p>
      <div className="flex items-center gap-3">
        <RankBadge rank={nextRank} size="sm" />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-ink">Reach {nextRank.name}</p>
          <p className="text-[10px] uppercase tracking-wide text-ink-muted">{nextRank.title}</p>
        </div>
        <Swords size={14} className="text-ink-muted" />
      </div>
      <div className="mt-2.5">
        <div className="mb-1 flex justify-between text-[10px] text-ink-muted">
          <span>{xpRemaining.toLocaleString()} XP to go</span>
          <span>{Math.round(rankProgressPct)}%</span>
        </div>
        <div className="h-1 overflow-hidden rounded-full bg-border">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${rankProgressPct}%`,
              background: `linear-gradient(90deg, ${rank.primary}, ${nextRank.primary})`,
            }}
          />
        </div>
      </div>
    </div>
  );
}
