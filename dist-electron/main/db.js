"use strict";
/* =========================
   DB: Better SQLite3 (UserData)
========================= */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const better_sqlite3_1 = __importDefault(require("better-sqlite3"));
const electron_1 = require("electron");
const node_path_1 = __importDefault(require("node:path"));
const node_fs_1 = __importDefault(require("node:fs"));
/* =========================
   DB PATH
========================= */
const dir = electron_1.app.getPath("userData");
node_fs_1.default.mkdirSync(dir, { recursive: true });
const dbPath = node_path_1.default.join(dir, "stock_formularios.sqlite");
/* =========================
   OPEN DB
========================= */
exports.db = new better_sqlite3_1.default(dbPath);
exports.db.pragma("journal_mode = WAL");
/* =========================
   SCHEMA
========================= */
exports.db.exec(`
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
