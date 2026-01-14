"use strict";
/* =========================
   PRELOAD: Secure bridge
========================= */
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
/* =========================
   EXPOSE API
========================= */
electron_1.contextBridge.exposeInMainWorld("api", {
    /* =========================
       PING
    ========================= */
    ping: () => "pong",
    /* =========================
       STOCK
    ========================= */
    stock: {
        list: () => electron_1.ipcRenderer.invoke("stock:list"),
        add: (input) => electron_1.ipcRenderer.invoke("stock:add", input),
        sell: (id) => electron_1.ipcRenderer.invoke("stock:sell", id),
        delete: (id) => electron_1.ipcRenderer.invoke("stock:delete", id),
    },
    /* =========================
       DASHBOARD
    ========================= */
    dashboard: {
        stats: () => electron_1.ipcRenderer.invoke("dashboard:stats"),
    },
    /* =========================
       TEMPLATES
    ========================= */
    templates: {
        list: () => electron_1.ipcRenderer.invoke("templates:list"),
        get: (id) => electron_1.ipcRenderer.invoke("templates:get", id),
        /* =========================
           CREATE (sin any / Any)
        ========================= */
        create: (input) => electron_1.ipcRenderer.invoke("templates:create", input),
        delete: (id) => electron_1.ipcRenderer.invoke("templates:delete", id),
    },
});
