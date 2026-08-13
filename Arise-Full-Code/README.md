# System.exe — Level Up Your Real Life

A local, offline-first **native Windows desktop app** that turns your daily
habits (gym, DSA, study, reading, meditation, etc.) into an anime-RPG
progression system: XP, levels, ranks, streaks, and a daily quest board.
All data lives in a SQLite file on your machine — nothing leaves your
computer, no internet connection required.

Two ready-to-hand-off deliverables ship alongside this source:

- **`System.exe-Setup-0.1.0.exe`** — a real NSIS installer. Double-click,
  Next → Install → Finish, get a Desktop + Start Menu shortcut, launch it
  like any other Windows app.
- **`System.exe-Portable-0.1.0.exe`** — no install step at all, just run it.

Neither requires Node.js, npm, a terminal, or a browser on the end user's
machine. Those are only needed if *you* want to keep developing the app.

## What makes this a "real" desktop app, not a website in a wrapper

- **Native window** — a normal `BrowserWindow` with the OS's own
  minimize/maximize/close controls, resizable, remembers its size and
  position between launches (see "Settings" below).
- **Splash screen** — a frameless, transparent window shows immediately
  on launch while the database initializes, then hands off to the main
  window with zero white-flash (`show: false` until `ready-to-show`).
- **Custom app icon** — generated at `public/icon.ico` / `public/icon.png`
  (regenerate anytime with `npm run icon`), embedded into the .exe itself,
  the taskbar, and the installer.
- **Offline by design** — no network calls anywhere in the app. All state
  lives in SQLite in the OS user-data folder.
- **Automatic local database, self-migrating** — on first launch the app
  creates its SQLite file and schema itself; on every later launch it
  checks for and applies any new schema migrations before the window
  opens. You never touch a config file or run a setup command.
- **Crash recovery** — if the renderer (the UI) crashes or hangs, the app
  catches it (`render-process-gone`) and offers a one-click reload instead
  of a frozen or blank window. Uncaught main-process errors are caught
  and the database is flushed before anything unwinds further.
- **Automatic save** — every quest toggle is written to disk immediately
  (temp-file-then-rename, so a crash mid-write can't corrupt the DB);
  window size/position are saved on resize/move/close.
- **Single-instance lock** — double-clicking the shortcut twice just
  focuses the existing window instead of opening a second copy that
  would fight over the same database file.
- **Versioned** — the app version (from `package.json`) is shown in the
  dashboard footer and is baked into the installer/portable filenames.

## UI

The app now has a full sidebar-navigation shell (Dashboard, Quests, Skills,
Inventory, Boss Battles, Achievements, Stats & Graphs, Shop, Leaderboard,
AI Assistant, Settings) matching a Solo Leveling-style RPG dashboard layout:
hero panel with an original character illustration, rank card, calendar,
motivation quote, a stats strip with streak/XP/achievements and a check-in
indicator, a quest list with per-quest progress bars, an avatar/equipment
panel, a guild card, a 7-day XP trend chart, a skill-growth radar chart
(driven by each quest's `skill` tag), and a 12-week activity heatmap.

Sections without a real underlying game system yet (Inventory, Boss
Battles, Shop, Leaderboard, AI Assistant) render a styled "Coming Soon"
placeholder rather than fake data — see "Extending it" below for what
each would need.

The hero artwork at `src/assets/hero-art.png` is an original illustration
generated for this app (`scripts/generate_hero_art.py`) — not a
reproduction of any copyrighted character.

## Achievements

7 achievements ship with real unlock conditions checked against your
actual play data (`electron/achievements.cjs`): first quest completed,
7-day and 30-day streaks, first project logged, 50 coding-quest
completions, and reaching level 10 / 25. Add more by appending to that
file — no migration needed, since the achievement rows themselves are
seeded once and unlock state is evaluated live on every state fetch.



- **Electron** — desktop shell (Windows-first, cross-platform capable)
- **React + TypeScript + Vite** — renderer UI
- **Tailwind CSS** — the dark neon/glassmorphism theme
- **Framer Motion** — level-up animation, XP bar, micro-interactions
- **Recharts** — 7-day XP trend chart
- **Zustand** — renderer state, thin wrapper over the IPC API
- **sql.js** — real SQLite, compiled to WASM. Chosen over `better-sqlite3`
  deliberately: it needs no native compiler toolchain (no Python/Visual
  Studio Build Tools), so `npm install` works out of the box on a fresh
  machine, and it packages cleanly into an asar archive.
- **electron-builder** — produces the NSIS installer and portable .exe

## How the pieces fit together

```
electron/main.cjs        Window + app lifecycle: splash screen, main
                          window, crash recovery, single-instance lock,
                          IPC handler registration.
electron/db.cjs           Owns the sql.js database: migration runner,
                          queries, atomic persistence to disk.
electron/migrations.cjs   Ordered, additive schema migrations — append
                          new ones here, never edit old ones.
electron/settings.cjs     Dependency-free JSON settings store (window
                          bounds today; a natural home for future prefs).
electron/preload.cjs      contextBridge — exposes window.api to the
                          renderer with no direct Node/IPC access.
electron/default-quests.cjs   Seed data inserted by migration 001 only.
electron/splash.html      The boot splash screen.

src/store/useAppStore.ts     Zustand store. Calls window.api, detects
                              level-ups by comparing level before/after
                              an XP change, and holds UI state.
src/lib/xp.ts                 XP curve + level derivation, pure functions.
src/data/ranks.ts              Level → rank/title lookup table.
src/components/                Dashboard, ProfileCard, QuestList/Item,
                                XPChart, LevelUpModal, XPBar.
```

Data flow for completing a quest: `QuestItem` click → `toggleQuest` in the
store → `window.api.toggleQuest(id)` → IPC to main → `db.cjs` inserts into
`quest_log`, updates `profile.total_xp`, recalculates streak, persists to
disk → main returns the fresh state snapshot → store diff-checks the level
and shows the level-up modal if it crossed a threshold.

## Developing

```bash
npm install
npm run dev
```

Starts the Vite dev server and launches Electron pointed at it, with hot
reload for the renderer.

## Building the installers yourself

```bash
npm run build        # tsc + vite build -> dist/
npm run dist          # electron-builder -> release/*.exe (NSIS + portable)
npm run dist:msi       # optional: MSI target
npm run dist:all       # NSIS + portable + MSI in one pass
```

This produces (in `release/`):

- `System.exe-Setup-<version>.exe` — NSIS installer (per-user, changeable
  install directory, Desktop + Start Menu shortcuts)
- `System.exe-Portable-<version>.exe` — single-file, no installation

**Building on Linux/macOS**: electron-builder needs Wine to stamp the exe
with its icon/version metadata, even for an unsigned build. On Ubuntu:
`sudo dpkg --add-architecture i386 && sudo apt-get update && sudo apt-get
install wine32:i386 wine64`. This repo's NSIS + portable targets were
built and verified this way. The MSI target additionally needs Wine Mono
and a display server (Xvfb) for the WiX toolchain — it's genuinely
optional, and easiest to produce on an actual Windows machine or a
Windows CI runner (e.g. GitHub Actions `windows-latest`) if you need it.
Building on Windows itself needs none of this — `npm run dist` just works.

**Code signing** (optional, not set up here): an unsigned installer will
show a Windows SmartScreen warning on first run. To remove that, get a
code-signing certificate and add `certificateFile`/`certificatePassword`
(or `CSC_LINK`/`CSC_KEY_PASSWORD` env vars) to the `build.win` config —
electron-builder picks them up automatically.

**Auto-update** (optional, not wired up here): the scaffold intentionally
ships with `"publish": null` so `electron-builder` never tries to reach a
release feed. To add auto-update later: install `electron-updater`, point
`build.publish` at a provider (GitHub Releases is the simplest), and call
`autoUpdater.checkForUpdatesAndNotify()` in `main.cjs` after the window
is created.

## The core loop, as implemented

- **Profile**: level, rank/title, current + longest streak, gold, total
  XP — all derived from `total_xp` via `getLevelInfo()` in `src/lib/xp.ts`.
- **Leveling**: XP to reach level *L+1* is `100 + (L-1)*40` — starts fast,
  scales up. Tune the curve in one place (`xpToNextLevel`).
- **Ranks**: 10 tiers from Beginner to Shadow Monarch, gated by level
  (`src/data/ranks.ts`).
- **Daily quests**: 12 seeded quests across Fitness / Coding / Study /
  Growth / Wellness, each with its own XP value. Checking one off logs it
  for today's date, adds XP, and updates streak (increments if you were
  active yesterday, resets to 1 otherwise). Unchecking refunds the XP.
- **Dashboard**: profile card, grouped quest checklist, 7-day XP area
  chart, today's XP total, app version footer.
- **Level-up moment**: full-screen particle-burst modal with a rank-change
  callout when you cross a rank boundary.

## Extending it

The original spec this was built from is much bigger (skill trees,
achievements, weekly/monthly reports, AI coach, inventory, focus timer,
etc.). This scaffold is structured so each is additive:

- **Skill tree**: each quest already carries a `skill` field — sum
  `quest_log.xp_awarded` grouped by `quests.skill` for per-skill XP.
- **Achievements**: the `achievements` table already exists (unused so
  far) — add unlock-condition checks alongside `toggleQuest` in `db.cjs`.
- **Weekly/monthly/yearly reports**: same `quest_log` table, different
  `GROUP BY` / date range — extend `getFullState()` or add a new IPC
  handler for a date-ranged query.
- **New schema changes**: append a new entry to `electron/migrations.cjs`
  — every existing user's local DB upgrades itself automatically next
  launch, no migration step for them to run.
- **AI Coach**: add a new IPC handler that runs local rule-based (or
  local-LLM-based) analysis over `quest_log` and returns a few sentences
  to render in a dashboard card. Stays offline-only by construction.
- **Custom habits / quest editor**: the `quests` table has no CRUD UI yet
  — add `quest:create` / `quest:update` / `quest:delete` IPC handlers plus
  a settings panel.

## Data & backups

Your database and settings live at (Windows):
`%APPDATA%\system-exe\system-exe.sqlite`
`%APPDATA%\system-exe\settings.json`

Since it's a plain SQLite file, backing it up is just copying that file.
CSV/PDF export and import (mentioned in the original spec) aren't wired
up yet — they'd read from the same `quest_log`/`profile` tables.

