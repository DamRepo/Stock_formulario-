/* =========================
   ELECTRON MAIN: Window + IPC
========================= */

import { app, BrowserWindow, ipcMain } from "electron";
import path from "node:path";

import {
  templatesList,
  templatesGet,
  templatesCreate,
  templatesDelete,
  stockList,
  stockAdd,
  stockSell,
  stockDelete,
  dashboardStats,
} from "./routes";

/* =========================
   FLAGS
========================= */

const isDev = !app.isPackaged;

/* =========================
   CREATE WINDOW
========================= */

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    backgroundColor: "#ffffff",
    webPreferences: {
      preload: path.join(__dirname, "../preload/index.cjs"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  if (isDev) {
    win.loadURL("http://localhost:5173/");
    win.webContents.openDevTools({ mode: "detach" });
  } else {
    // cuando empaquetes lo ajustamos fino si hace falta
    const indexHtml = path.join(__dirname, "../../dist/index.html");
    win.loadFile(indexHtml);
  }

  return win;
}

/* =========================
   APP LIFECYCLE
========================= */

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

/* =========================
   IPC: STOCK
========================= */

ipcMain.handle("stock:list", async () => stockList());
ipcMain.handle("stock:add", async (_e, input) => stockAdd(input));
ipcMain.handle("stock:sell", async (_e, id: string) => stockSell(id));
ipcMain.handle("stock:delete", async (_e, id: string) => stockDelete(id));

/* =========================
   IPC: DASHBOARD
========================= */

ipcMain.handle("dashboard:stats", async () => dashboardStats());

/* =========================
   IPC: TEMPLATES
========================= */

ipcMain.handle("templates:list", async () => templatesList());
ipcMain.handle("templates:get", async (_e, id: string) => templatesGet(id));
ipcMain.handle("templates:create", async (_e, input) => templatesCreate(input));
ipcMain.handle("templates:delete", async (_e, id: string) => templatesDelete(id));
