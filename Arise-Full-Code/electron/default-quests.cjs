// Seed quests inserted into the SQLite database on first launch.
// category groups quests for the dashboard; skill feeds the skill-tree XP split.
module.exports = [
  { id: "gym", label: "Complete Gym Session", category: "Fitness", skill: "Strength", xp: 50 },
  { id: "dsa-easy", label: "Solve 1 DSA Easy", category: "Coding", skill: "Intelligence", xp: 20 },
  { id: "dsa-medium", label: "Solve 1 DSA Medium", category: "Coding", skill: "Intelligence", xp: 40 },
  { id: "dsa-hard", label: "Solve 1 DSA Hard", category: "Coding", skill: "Intelligence", xp: 80 },
  { id: "leetcode-daily", label: "LeetCode Daily Challenge", category: "Coding", skill: "Intelligence", xp: 60 },
  { id: "project-work", label: "Project Work (1hr+)", category: "Coding", skill: "Intelligence", xp: 70 },
  { id: "college-study", label: "College Study Session", category: "Study", skill: "Knowledge", xp: 35 },
  { id: "reading", label: "Read 20 Pages", category: "Growth", skill: "Knowledge", xp: 25 },
  { id: "meditation", label: "Meditate", category: "Wellness", skill: "Focus", xp: 20 },
  { id: "water", label: "Hit Water Intake Goal", category: "Wellness", skill: "Health", xp: 10 },
  { id: "skincare", label: "Skin Care Routine", category: "Wellness", skill: "Appearance", xp: 15 },
  { id: "sleep", label: "Sleep Before 11 PM", category: "Wellness", skill: "Health", xp: 15 },
];
