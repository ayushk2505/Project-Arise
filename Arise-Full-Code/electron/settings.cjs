// Tiny, dependency-free settings store. Reads/writes a JSON file in the
// OS-appropriate app-data folder, so window position/size and future
// preferences survive restarts without any user configuration.

const fs = require("node:fs");
const path = require("node:path");

const DEFAULTS = {
  windowBounds: { width: 1440, height: 900, x: undefined, y: undefined },
  windowMaximized: false,
};

let settingsPath = "";
let cache = { ...DEFAULTS };

function init(userDataDir) {
  settingsPath = path.join(userDataDir, "settings.json");
  try {
    if (fs.existsSync(settingsPath)) {
      const raw = fs.readFileSync(settingsPath, "utf-8");
      cache = { ...DEFAULTS, ...JSON.parse(raw) };
    } else {
      cache = { ...DEFAULTS };
    }
  } catch {
    // Corrupt or unreadable settings file — fall back to defaults rather
    // than crashing the app on launch.
    cache = { ...DEFAULTS };
  }
  return cache;
}

function get() {
  return cache;
}

function set(partial) {
  cache = { ...cache, ...partial };
  save();
  return cache;
}

function save() {
  try {
    fs.writeFileSync(settingsPath, JSON.stringify(cache, null, 2));
  } catch {
    // Best-effort — a failed settings write should never crash the app.
  }
}

module.exports = { init, get, set, save };
