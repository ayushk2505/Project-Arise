const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const path = require("node:path");
const fs = require("node:fs");
const db = require("./db.cjs");
const settings = require("./settings.cjs");

const isDev = process.env.NODE_ENV === "development";
// Vite copies everything in public/ into dist/ at build time, and only
// dist/ (not public/) ships inside the packaged asar — so the icon must
// be read from there, not from the source public/ folder.
const ICON_PATH = path.join(__dirname, "..", "dist", "icon.png");

/** @type {import('electron').BrowserWindow | null} */
let splashWindow = null;
/** @type {import('electron').BrowserWindow | null} */
let mainWindow = null;

// ---------------------------------------------------------------------------
// Single-instance lock — prevents two copies of the app fighting over the
// same SQLite file if the user double-clicks the shortcut twice.
// ---------------------------------------------------------------------------

const gotLock = app.requestSingleInstanceLock();
if (!gotLock) {
  app.quit();
} else {
  app.on("second-instance", () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });
}

// ---------------------------------------------------------------------------
// Windows
// ---------------------------------------------------------------------------

function createSplashWindow() {
  splashWindow = new BrowserWindow({
    width: 380,
    height: 380,
    frame: false,
    transparent: true,
    resizable: false,
    movable: false,
    alwaysOnTop: true,
    skipTaskbar: true,
    icon: ICON_PATH,
    webPreferences: { contextIsolation: true },
  });
  splashWindow.loadFile(path.join(__dirname, "splash.html"));
}

function createMainWindow() {
  const saved = settings.get();
  const bounds = saved.windowBounds ?? {};

  mainWindow = new BrowserWindow({
    width: bounds.width ?? 1440,
    height: bounds.height ?? 900,
    x: bounds.x,
    y: bounds.y,
    minWidth: 1100,
    minHeight: 720,
    show: false, // reveal only once content has painted, avoids a white flash
    backgroundColor: "#0D0D0D",
    autoHideMenuBar: true,
    icon: ICON_PATH,
    title: "Arise",
    webPreferences: {
      preload: path.join(__dirname, "preload.cjs"),
      contextIsolation: true,
      nodeIntegration: false,
      spellcheck: false,
    },
  });

  if (saved.windowMaximized) mainWindow.maximize();

  if (isDev) {
    mainWindow.loadURL("http://localhost:5173");
  } else {
    mainWindow.loadFile(path.join(__dirname, "..", "dist", "index.html"));
  }

  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
    if (splashWindow && !splashWindow.isDestroyed()) splashWindow.destroy();
    splashWindow = null;
  });

  // Persist window geometry so the app reopens exactly where it was left —
  // "automatic save" applies to the window chrome too, not just quest data.
  const saveBounds = () => {
    if (!mainWindow || mainWindow.isDestroyed()) return;
    settings.set({
      windowBounds: mainWindow.getBounds(),
      windowMaximized: mainWindow.isMaximized(),
    });
  };
  mainWindow.on("resize", saveBounds);
  mainWindow.on("move", saveBounds);
  mainWindow.on("close", saveBounds);

  // Crash recovery: if the renderer (the React UI) dies or hangs, reload it
  // in place instead of leaving the user staring at a blank/frozen window.
  mainWindow.webContents.on("render-process-gone", (_event, details) => {
    console.error("Renderer process gone:", details.reason);
    if (details.reason !== "clean-exit") {
      dialog
        .showMessageBox(mainWindow, {
          type: "warning",
          title: "Arise",
          message: "The app hit a snag and needs to reload.",
          detail: "Your data is safe — it's saved to disk after every change.",
          buttons: ["Reload"],
        })
        .then(() => {
          if (mainWindow && !mainWindow.isDestroyed()) {
            mainWindow.loadFile(path.join(__dirname, "..", "dist", "index.html"));
          }
        });
    }
  });

  mainWindow.webContents.on("unresponsive", () => {
    console.warn("Renderer became unresponsive.");
  });
}

// ---------------------------------------------------------------------------
// IPC
// ---------------------------------------------------------------------------

function registerIpcHandlers() {
  ipcMain.handle("state:get", () => db.getFullState());
  ipcMain.handle("quest:toggle", (_event, questId) => db.toggleQuest(questId));
  ipcMain.handle("quest:create", (_event, data) => db.createQuest(data));
  ipcMain.handle("quest:update", (_event, questId, data) => db.updateQuest(questId, data));
  ipcMain.handle("quest:archive", (_event, questId) => db.archiveQuest(questId));
  ipcMain.handle("profile:update", (_event, fields) => db.updateProfile(fields));
  ipcMain.handle("friend:add", (_event, code) => db.addFriendByCode(code));
  ipcMain.handle("db:path", () => db.getDbPath());
  ipcMain.handle("app:version", () => app.getVersion());

  ipcMain.handle("profile:pickImage", async (_event, kind) => {
    if (!mainWindow) return null;
    const result = await dialog.showOpenDialog(mainWindow, {
      title: kind === "cover" ? "Choose a cover banner" : "Choose a profile picture",
      filters: [{ name: "Images", extensions: ["png", "jpg", "jpeg", "webp", "gif"] }],
      properties: ["openFile"],
    });
    if (result.canceled || result.filePaths.length === 0) return null;

    const sourcePath = result.filePaths[0];
    const ext = path.extname(sourcePath) || ".png";
    const imagesDir = path.join(app.getPath("userData"), "images");
    if (!fs.existsSync(imagesDir)) fs.mkdirSync(imagesDir, { recursive: true });

    const destName = `${kind}${ext}`;
    const destPath = path.join(imagesDir, destName);
    fs.copyFileSync(sourcePath, destPath);

    const updated = db.updateProfile({ [kind === "cover" ? "cover_path" : "avatar_path"]: destPath });
    return updated;
  });
}

// ---------------------------------------------------------------------------
// Lifecycle
// ---------------------------------------------------------------------------

if (gotLock) {
  app.whenReady().then(async () => {
    createSplashWindow();

    try {
      settings.init(app.getPath("userData"));
      await db.initDatabase(app.getPath("userData"));
    } catch (err) {
      console.error("Fatal startup error:", err);
      dialog.showErrorBox(
        "Arise failed to start",
        `The local database could not be initialized.\n\n${err instanceof Error ? err.message : String(err)}`
      );
      app.quit();
      return;
    }

    registerIpcHandlers();
    createMainWindow();

    app.on("activate", () => {
      if (BrowserWindow.getAllWindows().length === 0) createMainWindow();
    });
  });

  app.on("window-all-closed", () => {
    db.persist();
    if (process.platform !== "darwin") app.quit();
  });

  app.on("before-quit", () => {
    db.persist();
  });

  // Never let an uncaught error silently kill the app with no explanation —
  // the user should see something, even if it's just "please restart".
  process.on("uncaughtException", (err) => {
    console.error("Uncaught exception:", err);
    try {
      db.persist();
    } catch {
      // already logging the primary error; a secondary failure here isn't actionable
    }
  });
}
