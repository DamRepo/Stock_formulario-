"use strict";
/* =========================
   ROUTES: DB Functions
========================= */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.stockList = stockList;
exports.stockAdd = stockAdd;
exports.stockSell = stockSell;
exports.stockDelete = stockDelete;
exports.dashboardStats = dashboardStats;
exports.templatesList = templatesList;
exports.templatesGet = templatesGet;
exports.templatesDelete = templatesDelete;
exports.templatesCreate = templatesCreate;
const zod_1 = require("zod");
const node_crypto_1 = __importDefault(require("node:crypto"));
const db_1 = require("./db");
/* =========================
   STOCK: SCHEMAS
========================= */
const StockAddSchema = zod_1.z.object({
    formType: zod_1.z.string().min(1),
    serial: zod_1.z
        .string()
        .regex(/^\d+$/, "solo números")
        .min(12, "mínimo 12 dígitos"),
});
/* =========================
   STOCK: LIST
========================= */
function stockList() {
    return db_1.db
        .prepare(`
      SELECT
        id,
        form_type as formType,
        serial,
        status,
        created_at as createdAt
      FROM forms_stock
      ORDER BY created_at DESC
    `)
        .all();
}
/* =========================
   STOCK: ADD
========================= */
function stockAdd(input) {
    const parsed = StockAddSchema.parse(input);
    const id = node_crypto_1.default.randomUUID();
    const now = new Date().toISOString();
    // Si ya existe (formType + serial), SQLite tira error por UNIQUE
    db_1.db.prepare(`
    INSERT INTO forms_stock (id, form_type, serial, status, created_at)
    VALUES (?, ?, ?, 'stock', ?)
  `).run(id, parsed.formType.trim(), parsed.serial, now);
    return { ok: true, id };
}
/* =========================
   STOCK: SELL
========================= */
function stockSell(id) {
    db_1.db.prepare(`
    UPDATE forms_stock
    SET status='sold'
    WHERE id=?
  `).run(id);
    return { ok: true };
}
/* =========================
   STOCK: DELETE
========================= */
function stockDelete(id) {
    db_1.db.prepare(`DELETE FROM forms_stock WHERE id=?`).run(id);
    return { ok: true };
}
/* =========================
   DASHBOARD: STATS
========================= */
function dashboardStats() {
    const totalRow = db_1.db
        .prepare(`SELECT COUNT(*) as n FROM forms_stock`)
        .get();
    const stockRow = db_1.db
        .prepare(`SELECT COUNT(*) as n FROM forms_stock WHERE status='stock'`)
        .get();
    const soldRow = db_1.db
        .prepare(`SELECT COUNT(*) as n FROM forms_stock WHERE status='sold'`)
        .get();
    const byType = db_1.db
        .prepare(`SELECT
         form_type as formType,
         SUM(CASE WHEN status='stock' THEN 1 ELSE 0 END) as stock,
         COUNT(*) as total
       FROM forms_stock
       GROUP BY form_type
       ORDER BY form_type ASC`)
        .all();
    return {
        total: totalRow?.n ?? 0,
        stock: stockRow?.n ?? 0,
        sold: soldRow?.n ?? 0,
        byType: byType ?? [],
    };
}
/* =========================
   TEMPLATES: SCHEMAS
========================= */
const TemplateFieldSchema = zod_1.z.object({
    key: zod_1.z.string().min(1),
    label: zod_1.z.string().min(1),
    kind: zod_1.z.enum(["text", "number", "date", "select", "checkbox"]),
    required: zod_1.z.boolean().optional(),
    options: zod_1.z.array(zod_1.z.string()).optional(),
});
const TemplateCreateSchema = zod_1.z.object({
    name: zod_1.z.string().min(1),
    category: zod_1.z.string().min(1),
    fields: zod_1.z.array(TemplateFieldSchema),
});
/* =========================
   TEMPLATES: LIST
========================= */
function templatesList() {
    return db_1.db
        .prepare(`
      SELECT id, name, category, created_at
      FROM templates
      ORDER BY created_at DESC
    `)
        .all();
}
/* =========================
   TEMPLATES: GET
========================= */
function templatesGet(id) {
    const row = db_1.db
        .prepare(`SELECT id, name, category, fields_json, created_at
       FROM templates
       WHERE id = ?`)
        .get(id);
    if (!row)
        return null;
    return {
        id: row.id,
        name: row.name,
        category: row.category,
        created_at: row.created_at,
        fields: JSON.parse(row.fields_json),
    };
}
/* =========================
   TEMPLATES: DELETE
========================= */
function templatesDelete(id) {
    db_1.db.prepare(`DELETE FROM templates WHERE id = ?`).run(id);
    return { ok: true };
}
/* =========================
   TEMPLATES: CREATE
========================= */
function templatesCreate(input) {
    const parsed = TemplateCreateSchema.parse(input);
    const id = node_crypto_1.default.randomUUID();
    const now = new Date().toISOString();
    db_1.db.prepare(`
    INSERT INTO templates (id, name, category, fields_json, created_at)
    VALUES (?, ?, ?, ?, ?)
  `).run(id, parsed.name, parsed.category, JSON.stringify(parsed.fields), now);
    return { ok: true, id };
}
