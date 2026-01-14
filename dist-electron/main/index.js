"use strict";
/* =========================
   ELECTRON MAIN: Window + IPC
========================= */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const node_path_1 = __importDefault(require("node:path"));
const routes_1 = require("./routes");
/* =========================
   FLAGS
========================= */
const isDev = !electron_1.app.isPackaged;
/* =========================
   CREATE WINDOW
========================= */
function createWindow() {
    const win = new electron_1.BrowserWindow({
        width: 1200,
        height: 800,
        backgroundColor: "#ffffff",
        webPreferences: {
            preload: node_path_1.default.join(__dirname, "../preload/index.cjs"),
            contextIsolation: true,
            nodeIntegration: false,
        },
    });
    if (isDev) {
        win.loadURL("http://localhost:5173/");
        win.webContents.openDevTools({ mode: "detach" });
    }
    else {
        // cuando empaquetes lo ajustamos fino si hace falta
        const indexHtml = node_path_1.default.join(__dirname, "../../dist/index.html");
        win.loadFile(indexHtml);
    }
    return win;
}
/* =========================
   APP LIFECYCLE
========================= */
electron_1.app.whenReady().then(() => {
    createWindow();
    electron_1.app.on("activate", () => {
        if (electron_1.BrowserWindow.getAllWindows().length === 0)
            createWindow();
    });
});
electron_1.app.on("window-all-closed", () => {
    if (process.platform !== "darwin")
        electron_1.app.quit();
});
/* =========================
   IPC: STOCK
========================= */
electron_1.ipcMain.handle("stock:list", async () => (0, routes_1.stockList)());
electron_1.ipcMain.handle("stock:add", async (_e, input) => (0, routes_1.stockAdd)(input));
electron_1.ipcMain.handle("stock:sell", async (_e, id) => (0, routes_1.stockSell)(id));
electron_1.ipcMain.handle("stock:delete", async (_e, id) => (0, routes_1.stockDelete)(id));
/* =========================
   IPC: DASHBOARD
========================= */
electron_1.ipcMain.handle("dashboard:stats", async () => (0, routes_1.dashboardStats)());
/* =========================
   IPC: TEMPLATES
========================= */
electron_1.ipcMain.handle("templates:list", async () => (0, routes_1.templatesList)());
electron_1.ipcMain.handle("templates:get", async (_e, id) => (0, routes_1.templatesGet)(id));
electron_1.ipcMain.handle("templates:create", async (_e, input) => (0, routes_1.templatesCreate)(input));
electron_1.ipcMain.handle("templates:delete", async (_e, id) => (0, routes_1.templatesDelete)(id));
