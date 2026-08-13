export interface RankDef {
  id: "D" | "C" | "B" | "A" | "S";
  name: string;
  title: string;
  minLevel: number;
  xpRequired: number; // cumulative total XP needed to enter this rank
  primary: string; // hex
  secondary: string; // hex
  glow: string; // rgba box-shadow color
}

// Ordered ascending by minLevel — the active rank is the last one whose
// minLevel is <= the player's current level. xpRequired is derived from
// the same level curve as src/lib/xp.ts so the two never disagree.
export const RANKS: RankDef[] = [
  {
    id: "D",
    name: "D-Rank",
    title: "Beginner",
    minLevel: 1,
    xpRequired: 0,
    primary: "#9CA3AF",
    secondary: "#6B7280",
    glow: "rgba(156, 163, 175, 0.45)",
  },
  {
    id: "C",
    name: "C-Rank",
    title: "Explorer",
    minLevel: 10,
    xpRequired: 2340,
    primary: "#34D399",
    secondary: "#22D3EE",
    glow: "rgba(52, 211, 153, 0.45)",
  },
  {
    id: "B",
    name: "B-Rank",
    title: "Warrior",
    minLevel: 25,
    xpRequired: 13440,
    primary: "#3B82F6",
    secondary: "#8B5CF6",
    glow: "rgba(59, 130, 246, 0.5)",
  },
  {
    id: "A",
    name: "A-Rank",
    title: "Elite",
    minLevel: 50,
    xpRequired: 51940,
    primary: "#8B5CF6",
    secondary: "#EC4899",
    glow: "rgba(139, 92, 246, 0.55)",
  },
  {
    id: "S",
    name: "S-Rank",
    title: "Legend",
    minLevel: 80,
    xpRequired: 131140,
    primary: "#F5C453",
    secondary: "#F97316",
    glow: "rgba(245, 196, 83, 0.6)",
  },
];

export function getRankForLevel(level: number): RankDef {
  let current = RANKS[0];
  for (const rank of RANKS) {
    if (level >= rank.minLevel) current = rank;
    else break;
  }
  return current;
}

export function getNextRank(level: number): RankDef | null {
  const current = getRankForLevel(level);
  const idx = RANKS.findIndex((r) => r.id === current.id);
  return RANKS[idx + 1] ?? null;
}
