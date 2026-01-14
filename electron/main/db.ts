/* =========================
   DB: Better SQLite3 (UserData)
========================= */

import Database from "better-sqlite3";
import { app } from "electron";
import path from "node:path";
import fs from "node:fs";

/* =========================
   DB PATH
========================= */

const dir = app.getPath("userData");
fs.mkdirSync(dir, { recursive: true });

const dbPath = path.join(dir, "stock_formularios.sqlite");

/* =========================
   OPEN DB
========================= */

export const db = new Database(dbPath);
db.pragma("journal_mode = WAL");

/* =========================
   SCHEMA
========================= */

db.exec(`
  CREATE TABLE IF NOT EXISTS forms_stock (
    id TEXT PRIMARY KEY,
    form_type TEXT NOT NULL,
    serial TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('stock','used','sold')),
    created_at TEXT NOT NULL
  );

  CREATE UNIQUE INDEX IF NOT EXISTS idx_forms_unique
  ON forms_stock (form_type, serial);

  CREATE TABLE IF NOT EXISTS templates (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    fields_json TEXT NOT NULL,
    created_at TEXT NOT NULL
  );
`);
