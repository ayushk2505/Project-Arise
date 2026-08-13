// Each migration runs exactly once, in order, tracked in schema_migrations.
// To change the schema in the future: append a new { id, run(db) } entry —
// never edit an existing one. Every user's local DB upgrades itself the
// next time the app launches.

const defaultQuests = require("./default-quests.cjs");
const achievementDefs = require("./achievements.cjs");
const { generateFriendCode } = require("./friend-code.cjs");

module.exports = [
  {
    id: "001_init",
    run(db) {
      db.run(`
        CREATE TABLE IF NOT EXISTS profile (
          id INTEGER PRIMARY KEY CHECK (id = 1),
          total_xp INTEGER NOT NULL DEFAULT 0,
          gold INTEGER NOT NULL DEFAULT 0,
          current_streak INTEGER NOT NULL DEFAULT 0,
          longest_streak INTEGER NOT NULL DEFAULT 0,
          last_active_date TEXT
        );

        CREATE TABLE IF NOT EXISTS quests (
          id TEXT PRIMARY KEY,
          label TEXT NOT NULL,
          category TEXT NOT NULL,
          skill TEXT NOT NULL,
          xp INTEGER NOT NULL,
          sort_order INTEGER NOT NULL DEFAULT 0
        );

        CREATE TABLE IF NOT EXISTS quest_log (
          date TEXT NOT NULL,
          quest_id TEXT NOT NULL,
          xp_awarded INTEGER NOT NULL,
          completed_at TEXT NOT NULL,
          PRIMARY KEY (date, quest_id)
        );

        CREATE TABLE IF NOT EXISTS achievements (
          id TEXT PRIMARY KEY,
          label TEXT NOT NULL,
          description TEXT NOT NULL,
          unlocked_at TEXT
        );
      `);

      db.run(
        "INSERT INTO profile (id, total_xp, gold, current_streak, longest_streak, last_active_date) VALUES (1, 0, 0, 0, 0, NULL)"
      );

      const stmt = db.prepare(
        "INSERT INTO quests (id, label, category, skill, xp, sort_order) VALUES (?, ?, ?, ?, ?, ?)"
      );
      defaultQuests.forEach((q, i) => stmt.run([q.id, q.label, q.category, q.skill, q.xp, i]));
      stmt.free();
    },
  },
  // 002_add_skill_totals, 003_add_settings_table, etc. get appended here
  // as the app grows — see README "Extending it".
  {
    id: "002_seed_achievements",
    run(db) {
      const stmt = db.prepare(
        "INSERT OR IGNORE INTO achievements (id, label, description, unlocked_at) VALUES (?, ?, ?, NULL)"
      );
      achievementDefs.forEach((a) => stmt.run([a.id, a.label, a.description]));
      stmt.free();
    },
  },
  {
    id: "003_profile_and_quest_overhaul",
    run(db) {
      // --- Profile: full customization surface ---
      const profileCols = [
        ["username", "TEXT"],
        ["display_name", "TEXT DEFAULT 'Adventurer'"],
        ["bio", "TEXT DEFAULT ''"],
        ["email", "TEXT"],
        ["phone", "TEXT"],
        ["dob", "TEXT"],
        ["gender", "TEXT"],
        ["country", "TEXT"],
        ["timezone", "TEXT"],
        ["avatar_path", "TEXT"],
        ["cover_path", "TEXT"],
        ["theme", "TEXT DEFAULT 'dark'"],
        ["accent_color", "TEXT DEFAULT 'purple'"],
        ["font_size", "TEXT DEFAULT 'md'"],
        ["daily_xp_goal", "INTEGER DEFAULT 100"],
        ["weekly_xp_goal", "INTEGER DEFAULT 500"],
        ["working_hours_start", "TEXT DEFAULT '09:00'"],
        ["working_hours_end", "TEXT DEFAULT '18:00'"],
        ["reminder_time", "TEXT DEFAULT '20:00'"],
        ["notification_style", "TEXT DEFAULT 'popup'"],
        ["friend_code", "TEXT"],
      ];
      for (const [name, def] of profileCols) {
        db.run(`ALTER TABLE profile ADD COLUMN ${name} ${def}`);
      }
      db.run("UPDATE profile SET friend_code = ? WHERE id = 1", [generateFriendCode("PLAYER")]);

      // --- Quests: user-driven creation, custom XP, scheduling metadata ---
      const questCols = [
        ["description", "TEXT DEFAULT ''"],
        ["difficulty", "TEXT DEFAULT 'medium'"],
        ["priority", "TEXT DEFAULT 'normal'"],
        ["due_date", "TEXT"],
        ["start_time", "TEXT"],
        ["end_time", "TEXT"],
        ["repeat_schedule", "TEXT DEFAULT 'daily'"],
        ["reminder_time", "TEXT"],
        ["notes", "TEXT DEFAULT ''"],
        ["is_archived", "INTEGER DEFAULT 0"],
      ];
      for (const [name, def] of questCols) {
        db.run(`ALTER TABLE quests ADD COLUMN ${name} ${def}`);
      }

      // --- Friends: local data model only. Actually syncing two users'
      // apps needs a backend service that doesn't exist in this offline,
      // single-user desktop app — this table exists so the UI has
      // somewhere real to read/write once that service is built. No rows
      // are seeded; a friends list starts empty rather than faked.
      db.run(`
        CREATE TABLE IF NOT EXISTS friends (
          id TEXT PRIMARY KEY,
          friend_code TEXT NOT NULL,
          display_name TEXT NOT NULL,
          added_at TEXT NOT NULL
        );
      `);
    },
  },
  {
    id: "004_onboarding",
    run(db) {
      db.run("ALTER TABLE profile ADD COLUMN onboarding_complete INTEGER DEFAULT 0");
      db.run("ALTER TABLE profile ADD COLUMN age INTEGER");
    },
  },
];
