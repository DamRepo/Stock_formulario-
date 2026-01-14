/* =========================
   PRELOAD: Secure bridge
========================= */

import { contextBridge, ipcRenderer } from "electron";

/* =========================
   TYPES: Templates
========================= */

type TemplateField = {
  key: string;
  label: string;
  kind: "text" | "number" | "date" | "select" | "checkbox";
  required?: boolean;
  options?: string[];
};

type TemplateCreateInput = {
  name: string;
  category: string;
  fields: TemplateField[];
};

/* =========================
   EXPOSE API
========================= */

contextBridge.exposeInMainWorld("api", {
  /* =========================
     PING
  ========================= */
  ping: () => "pong",

  /* =========================
     STOCK
  ========================= */
  stock: {
    list: () => ipcRenderer.invoke("stock:list"),
    add: (input: { formType: string; serial: string }) =>
      ipcRenderer.invoke("stock:add", input),
    sell: (id: string) => ipcRenderer.invoke("stock:sell", id),
    delete: (id: string) => ipcRenderer.invoke("stock:delete", id),
  },

  /* =========================
     DASHBOARD
  ========================= */
  dashboard: {
    stats: () => ipcRenderer.invoke("dashboard:stats"),
  },

  /* =========================
     TEMPLATES
  ========================= */
  templates: {
    list: () => ipcRenderer.invoke("templates:list"),
    get: (id: string) => ipcRenderer.invoke("templates:get", id),

    /* =========================
       CREATE (sin any / Any)
    ========================= */
    create: (input: TemplateCreateInput) =>
      ipcRenderer.invoke("templates:create", input),

    delete: (id: string) => ipcRenderer.invoke("templates:delete", id),
  },
});
