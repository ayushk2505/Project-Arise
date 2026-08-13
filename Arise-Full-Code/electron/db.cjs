const path = require("node:path");
const fs = require("node:fs");
const initSqlJs = require("sql.js");
const migrations = require("./migrations.cjs");
const achievementDefs = require("./achievements.cjs");
const { levelFromTotalXp } = require("./xp.cjs");

let db = null;
let dbPath = "";

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

function daysAgoStr(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}

function runQuery(sql, params = []) {
  const stmt = db.prepare(sql);
  stmt.bind(params);
  const rows = [];
  while (stmt.step()) rows.push(stmt.getAsObject());
  stmt.free();
  return rows;
}

function persist() {
  if (!db || !dbPath) return;
  const data = db.export();
  // Write to a temp file first and rename, so a crash mid-write can never
  // leave a corrupted database file behind.
  const tmpPath = `${dbPath}.tmp`;
  fs.writeFileSync(tmpPath, Buffer.from(data));
  fs.renameSync(tmpPath, dbPath);
}

function runMigrations() {
  db.run(
    "CREATE TABLE IF NOT EXISTS schema_migrations (id TEXT PRIMARY KEY, applied_at TEXT NOT NULL)"
  );
  const applied = new Set(runQuery("SELECT id FROM schema_migrations").map((r) => r.id));

  for (const migration of migrations) {
    if (applied.has(migration.id)) continue;
    migration.run(db);
    db.run("INSERT INTO schema_migrations (id, applied_at) VALUES (?, ?)", [
      migration.id,
      new Date().toISOString(),
    ]);
  }
}

async function initDatabase(userDataDir) {
  const SQL = await initSqlJs({
    locateFile: () => require.resolve("sql.js/dist/sql-wasm.wasm"),
  });

  if (!fs.existsSync(userDataDir)) fs.mkdirSync(userDataDir, { recursive: true });
  dbPath = path.join(userDataDir, "system-exe.sqlite");

  if (fs.existsSync(dbPath)) {
    db = new SQL.Database(fs.readFileSync(dbPath));
  } else {
    db = new SQL.Database();
  }

  runMigrations();
  persist();
}

function getSkillTotals() {
  // Sum XP per skill tag across all-time quest completions.
  const rows = runQuery(
    `SELECT q.skill as skill, SUM(l.xp_awarded) as xp
     FROM quest_log l JOIN quests q ON q.id = l.quest_id
     GROUP BY q.skill`
  );
  return rows.map((r) => ({ skill: r.skill, xp: r.xp ?? 0 }));
}

function getActivityHeatmap(days) {
  const since = daysAgoStr(days - 1);
  const rows = runQuery(
    "SELECT date, SUM(xp_awarded) as xp FROM quest_log WHERE date >= ? GROUP BY date",
    [since]
  );
  const map = new Map(rows.map((r) => [r.date, r.xp]));
  const out = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = daysAgoStr(i);
    out.push({ date: d, xp: map.get(d) ?? 0 });
  }
  return out;
}

function getAggregateStats(profile) {
  const completionRows = runQuery(
    "SELECT quest_id, COUNT(*) as c FROM quest_log GROUP BY quest_id"
  );
  const completionsByQuest = {};
  let totalCompletions = 0;
  for (const r of completionRows) {
    completionsByQuest[r.quest_id] = r.c;
    totalCompletions += r.c;
  }
  const codingIds = ["dsa-easy", "dsa-medium", "dsa-hard", "leetcode-daily", "project-work"];
  const codingCompletions = codingIds.reduce((sum, id) => sum + (completionsByQuest[id] ?? 0), 0);

  return {
    totalCompletions,
    completionsByQuest,
    codingCompletions,
    longestStreak: profile.longest_streak,
    level: levelFromTotalXp(profile.total_xp),
  };
}

function getActiveQuestCount() {
  const row = runQuery("SELECT COUNT(*) as c FROM quests WHERE is_archived = 0")[0];
  return row?.c ?? 0;
}

function getCompletionRate(days) {
  const activeCount = getActiveQuestCount();
  if (activeCount === 0) return 0;
  const since = daysAgoStr(days - 1);
  const rows = runQuery(
    "SELECT date, COUNT(*) as c FROM quest_log WHERE date >= ? GROUP BY date",
    [since]
  );
  if (days === 1) {
    return Math.round(((rows[0]?.c ?? 0) / activeCount) * 100);
  }
  const totalPossible = activeCount * days;
  const totalCompleted = rows.reduce((sum, r) => sum + r.c, 0);
  return totalPossible > 0 ? Math.round((totalCompleted / totalPossible) * 100) : 0;
}

function getWeeklyXp() {
  const since = daysAgoStr(6);
  const row = runQuery("SELECT SUM(xp_awarded) as xp FROM quest_log WHERE date >= ?", [since])[0];
  return row?.xp ?? 0;
}

function getMonthlyXp() {
  const since = daysAgoStr(29);
  const row = runQuery("SELECT SUM(xp_awarded) as xp FROM quest_log WHERE date >= ?", [since])[0];
  return row?.xp ?? 0;
}

const RARITY_POINTS = { common: 10, rare: 25, epic: 50 };

function getStatsSummary(profile, aggregate, achievementCount, achievementPoints) {
  return {
    level: aggregate.level,
    totalXp: profile.total_xp,
    weeklyXp: getWeeklyXp(),
    monthlyXp: getMonthlyXp(),
    currentStreak: profile.current_streak,
    longestStreak: profile.longest_streak,
    totalQuestsCompleted: aggregate.totalCompletions,
    dailyCompletionRate: getCompletionRate(1),
    weeklyCompletionRate: getCompletionRate(7),
    monthlyCompletionRate: getCompletionRate(30),
    // No focus-timer feature exists yet to measure this honestly, so it's
    // reported as 0 rather than estimated — see README.
    totalFocusHours: 0,
    achievementCount,
    achievementPoints,
  };
}

function evaluateAchievements(profile) {
  const stats = getAggregateStats(profile);
  const unlockedRows = runQuery("SELECT id FROM achievements WHERE unlocked_at IS NOT NULL");
  const unlockedIds = new Set(unlockedRows.map((r) => r.id));
  const now = new Date().toISOString();

  for (const def of achievementDefs) {
    if (unlockedIds.has(def.id)) continue;
    if (def.check(stats)) {
      db.run("UPDATE achievements SET unlocked_at = ? WHERE id = ?", [now, def.id]);
    }
  }
}

function getFullState() {
  const profile = runQuery("SELECT * FROM profile WHERE id = 1")[0];
  const quests = runQuery(
    "SELECT * FROM quests WHERE is_archived = 0 ORDER BY sort_order ASC"
  );
  const today = todayStr();
  const todayLog = runQuery("SELECT quest_id FROM quest_log WHERE date = ?", [today]);
  const completedToday = new Set(todayLog.map((r) => r.quest_id));

  const since = daysAgoStr(6);
  const historyRows = runQuery(
    "SELECT date, SUM(xp_awarded) as xp FROM quest_log WHERE date >= ? GROUP BY date ORDER BY date ASC",
    [since]
  );
  const historyMap = new Map(historyRows.map((r) => [r.date, r.xp]));
  const last7Days = [];
  for (let i = 6; i >= 0; i--) {
    const d = daysAgoStr(i);
    last7Days.push({ date: d, xp: historyMap.get(d) ?? 0 });
  }

  evaluateAchievements(profile);
  const achievementRows = runQuery("SELECT * FROM achievements ORDER BY rowid ASC");
  const achievementMeta = new Map(achievementDefs.map((d) => [d.id, d]));
  const achievements = achievementRows.map((r) => ({
    ...r,
    rarity: achievementMeta.get(r.id)?.rarity ?? "common",
  }));

  const skillTotals = getSkillTotals();
  const heatmap = getActivityHeatmap(84); // ~12 weeks
  const aggregate = getAggregateStats(profile);
  const achievementCount = achievements.filter((a) => a.unlocked_at).length;
  const achievementPoints = achievements
    .filter((a) => a.unlocked_at)
    .reduce((sum, a) => sum + (RARITY_POINTS[a.rarity] ?? 0), 0);
  const stats = getStatsSummary(profile, aggregate, achievementCount, achievementPoints);
  const friends = runQuery("SELECT * FROM friends ORDER BY added_at DESC");

  return {
    profile,
    quests: quests.map((q) => ({ ...q, completedToday: completedToday.has(q.id) })),
    last7Days,
    achievements,
    skillTotals,
    heatmap,
    stats,
    friends,
  };
}

function applyStreak(profile) {
  const today = todayStr();
  if (profile.last_active_date === today) return profile;
  const yesterday = daysAgoStr(1);
  let currentStreak = 1;
  if (profile.last_active_date === yesterday) {
    currentStreak = profile.current_streak + 1;
  }
  const longestStreak = Math.max(profile.longest_streak, currentStreak);
  db.run(
    "UPDATE profile SET current_streak = ?, longest_streak = ?, last_active_date = ? WHERE id = 1",
    [currentStreak, longestStreak, today]
  );
  return runQuery("SELECT * FROM profile WHERE id = 1")[0];
}

function toggleQuest(questId) {
  const today = todayStr();
  const quest = runQuery("SELECT * FROM quests WHERE id = ?", [questId])[0];
  if (!quest) return { state: getFullState(), justAwardedXp: null };

  const existing = runQuery("SELECT * FROM quest_log WHERE date = ? AND quest_id = ?", [
    today,
    questId,
  ])[0];

  let justAwardedXp = null;

  if (existing) {
    db.run("DELETE FROM quest_log WHERE date = ? AND quest_id = ?", [today, questId]);
    db.run("UPDATE profile SET total_xp = MAX(0, total_xp - ?) WHERE id = 1", [
      existing.xp_awarded,
    ]);
  } else {
    db.run(
      "INSERT INTO quest_log (date, quest_id, xp_awarded, completed_at) VALUES (?, ?, ?, ?)",
      [today, questId, quest.xp, new Date().toISOString()]
    );
    db.run("UPDATE profile SET total_xp = total_xp + ? WHERE id = 1", [quest.xp]);
    let profile = runQuery("SELECT * FROM profile WHERE id = 1")[0];
    applyStreak(profile);
    justAwardedXp = quest.xp;
  }

  persist();
  return { state: getFullState(), justAwardedXp };
}

// Columns a user is allowed to edit via the Settings UI. Whitelisted
// explicitly so an IPC call can never write to xp/streak/id columns.
const EDITABLE_PROFILE_FIELDS = [
  "username",
  "display_name",
  "bio",
  "email",
  "phone",
  "dob",
  "gender",
  "country",
  "timezone",
  "avatar_path",
  "cover_path",
  "theme",
  "accent_color",
  "font_size",
  "daily_xp_goal",
  "weekly_xp_goal",
  "working_hours_start",
  "working_hours_end",
  "reminder_time",
  "notification_style",
  "age",
  "onboarding_complete",
];

function updateProfile(fields) {
  const entries = Object.entries(fields || {}).filter(([key]) =>
    EDITABLE_PROFILE_FIELDS.includes(key)
  );
  if (entries.length === 0) return getFullState();

  const setClause = entries.map(([key]) => `${key} = ?`).join(", ");
  const values = entries.map(([, value]) => value);
  db.run(`UPDATE profile SET ${setClause} WHERE id = 1`, values);
  persist();
  return getFullState();
}

function nextSortOrder() {
  const row = runQuery("SELECT MAX(sort_order) as m FROM quests")[0];
  return (row?.m ?? -1) + 1;
}

function createQuest(data) {
  const id = `custom-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  db.run(
    `INSERT INTO quests
      (id, label, category, skill, xp, sort_order, description, difficulty, priority,
       due_date, start_time, end_time, repeat_schedule, reminder_time, notes, is_archived)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)`,
    [
      id,
      data.label,
      data.category || "Custom",
      data.skill || "Focus",
      Number(data.xp) || 10,
      nextSortOrder(),
      data.description || "",
      data.difficulty || "medium",
      data.priority || "normal",
      data.due_date || null,
      data.start_time || null,
      data.end_time || null,
      data.repeat_schedule || "daily",
      data.reminder_time || null,
      data.notes || "",
    ]
  );
  persist();
  return getFullState();
}

const UPDATABLE_QUEST_FIELDS = [
  "label",
  "category",
  "skill",
  "xp",
  "description",
  "difficulty",
  "priority",
  "due_date",
  "start_time",
  "end_time",
  "repeat_schedule",
  "reminder_time",
  "notes",
];

function updateQuest(questId, data) {
  const entries = Object.entries(data || {}).filter(([key]) =>
    UPDATABLE_QUEST_FIELDS.includes(key)
  );
  if (entries.length === 0) return getFullState();

  const setClause = entries.map(([key]) => `${key} = ?`).join(", ");
  const values = entries.map(([key, value]) => (key === "xp" ? Number(value) || 0 : value));
  db.run(`UPDATE quests SET ${setClause} WHERE id = ?`, [...values, questId]);
  persist();
  return getFullState();
}

function archiveQuest(questId) {
  // Soft delete: keeps quest_log history (and thus past XP/stats) intact
  // even after a quest is removed from the active list.
  db.run("UPDATE quests SET is_archived = 1 WHERE id = ?", [questId]);
  persist();
  return getFullState();
}

function addFriendByCode(code) {
  // Honest limitation: there is no backend service to look up another
  // person's device by friend code. This app is fully offline and
  // single-user by design. The schema and IPC plumbing are real and
  // ready to wire up once a sync service exists — this just can't
  // pretend to find a real person on the other end of `code` today.
  return {
    success: false,
    reason: "no_backend",
    message:
      "Friends require a cloud sync service that isn't set up yet. This app currently runs fully offline.",
    state: getFullState(),
  };
}

module.exports = {
  initDatabase,
  getFullState,
  toggleQuest,
  updateProfile,
  createQuest,
  updateQuest,
  archiveQuest,
  addFriendByCode,
  persist,
  getDbPath: () => dbPath,
};
