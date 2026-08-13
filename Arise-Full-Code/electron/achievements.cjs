// Achievement catalogue. Each entry's `check(stats)` runs against
// aggregate stats computed in db.cjs; when it first returns true the
// achievement is stamped with unlocked_at and stays unlocked forever
// (checked in later, never re-locked).
module.exports = [
  {
    id: "first-step",
    label: "First Step",
    description: "Complete your first quest.",
    rarity: "common",
    check: (s) => s.totalCompletions >= 1,
  },
  {
    id: "seven-day-streak",
    label: "7 Day Streak",
    description: "Keep a streak alive for 7 days.",
    rarity: "common",
    check: (s) => s.longestStreak >= 7,
  },
  {
    id: "first-project",
    label: "First Project",
    description: "Log your first project work session.",
    rarity: "rare",
    check: (s) => (s.completionsByQuest["project-work"] ?? 0) >= 1,
  },
  {
    id: "coding-beast",
    label: "Coding Beast",
    description: "Complete 50 coding quests (DSA, LeetCode, or project work).",
    rarity: "rare",
    check: (s) => s.codingCompletions >= 50,
  },
  {
    id: "thirty-day-streak",
    label: "Legendary Discipline",
    description: "Keep a streak alive for 30 days.",
    rarity: "epic",
    check: (s) => s.longestStreak >= 30,
  },
  {
    id: "level-10",
    label: "Double Digits",
    description: "Reach level 10.",
    rarity: "rare",
    check: (s) => s.level >= 10,
  },
  {
    id: "level-25",
    label: "Quarter Century",
    description: "Reach level 25.",
    rarity: "epic",
    check: (s) => s.level >= 25,
  },
];
