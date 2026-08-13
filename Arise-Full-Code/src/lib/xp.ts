import { getRankForLevel, getNextRank, type RankDef } from "../data/ranks";

// XP required to go from level L to L+1. Grows linearly so early levels
// come quickly (motivating) and later levels take real sustained effort.
export function xpToNextLevel(level: number): number {
  return 100 + (level - 1) * 40;
}

export interface LevelInfo {
  level: number;
  xpIntoLevel: number;
  xpForThisLevel: number;
  totalXp: number;
  rank: RankDef;
  nextRank: RankDef | null;
  // Progress (0-100) from the current rank's XP threshold toward the next
  // rank's threshold — used for the rank progress bar, distinct from the
  // per-level XP bar.
  rankProgressPct: number;
}

export function getLevelInfo(totalXp: number): LevelInfo {
  let level = 1;
  let remaining = totalXp;

  // Walk up levels until remaining XP is less than what's needed for the next one.
  // Capped so a runaway totalXp value can't loop forever.
  for (let i = 0; i < 500; i++) {
    const needed = xpToNextLevel(level);
    if (remaining < needed) break;
    remaining -= needed;
    level += 1;
  }

  const rank = getRankForLevel(level);
  const nextRank = getNextRank(level);
  let rankProgressPct = 100;
  if (nextRank) {
    const span = nextRank.xpRequired - rank.xpRequired;
    const into = totalXp - rank.xpRequired;
    rankProgressPct = span > 0 ? Math.min(100, Math.max(0, (into / span) * 100)) : 100;
  }

  return {
    level,
    xpIntoLevel: remaining,
    xpForThisLevel: xpToNextLevel(level),
    totalXp,
    rank,
    nextRank,
    rankProgressPct,
  };
}
