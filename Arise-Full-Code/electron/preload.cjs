const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
  getState: () => ipcRenderer.invoke("state:get"),
  toggleQuest: (questId) => ipcRenderer.invoke("quest:toggle", questId),
  createQuest: (data) => ipcRenderer.invoke("quest:create", data),
  updateQuest: (questId, data) => ipcRenderer.invoke("quest:update", questId, data),
  archiveQuest: (questId) => ipcRenderer.invoke("quest:archive", questId),
  updateProfile: (fields) => ipcRenderer.invoke("profile:update", fields),
  pickProfileImage: (kind) => ipcRenderer.invoke("profile:pickImage", kind),
  addFriend: (code) => ipcRenderer.invoke("friend:add", code),
  getDbPath: () => ipcRenderer.invoke("db:path"),
  getAppVersion: () => ipcRenderer.invoke("app:version"),
});
