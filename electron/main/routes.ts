/* =========================
   ROUTES: DB Functions
========================= */

import { z } from "zod";
import crypto from "node:crypto";
import { db } from "./db";

/* =========================
   STOCK: SCHEMAS
========================= */

const StockAddSchema = z.object({
  formType: z.string().min(1),
  serial: z
    .string()
    .regex(/^\d+$/, "solo números")
    .min(12, "mínimo 12 dígitos"),
});

type StockAddInput = z.infer<typeof StockAddSchema>;

/* =========================
   STOCK: LIST
========================= */

export function stockList() {
  return db
    .prepare(
      `
      SELECT
        id,
        form_type as formType,
        serial,
        status,
        created_at as createdAt
      FROM forms_stock
      ORDER BY created_at DESC
    `
    )
    .all();
}

/* =========================
   STOCK: ADD
========================= */

export function stockAdd(input: StockAddInput) {
  const parsed = StockAddSchema.parse(input);

  const id = crypto.randomUUID();
  const now = new Date().toISOString();

  // Si ya existe (formType + serial), SQLite tira error por UNIQUE
  db.prepare(
    `
    INSERT INTO forms_stock (id, form_type, serial, status, created_at)
    VALUES (?, ?, ?, 'stock', ?)
  `
  ).run(id, parsed.formType.trim(), parsed.serial, now);

  return { ok: true as const, id };
}

/* =========================
   STOCK: SELL
========================= */

export function stockSell(id: string) {
  db.prepare(
    `
    UPDATE forms_stock
    SET status='sold'
    WHERE id=?
  `
  ).run(id);

  return { ok: true as const };
}

/* =========================
   STOCK: DELETE
========================= */

export function stockDelete(id: string) {
  db.prepare(`DELETE FROM forms_stock WHERE id=?`).run(id);
  return { ok: true as const };
}

/* =========================
   DASHBOARD: STATS
========================= */
export function dashboardStats() {
  const totalRow = db
    .prepare(`SELECT COUNT(*) as n FROM forms_stock`)
    .get() as { n: number };

  const stockRow = db
    .prepare(`SELECT COUNT(*) as n FROM forms_stock WHERE status='stock'`)
    .get() as { n: number };

  const soldRow = db
    .prepare(`SELECT COUNT(*) as n FROM forms_stock WHERE status='sold'`)
    .get() as { n: number };

  const byType = db
    .prepare(
      `SELECT
         form_type as formType,
         SUM(CASE WHEN status='stock' THEN 1 ELSE 0 END) as stock,
         COUNT(*) as total
       FROM forms_stock
       GROUP BY form_type
       ORDER BY form_type ASC`
    )
    .all() as Array<{ formType: string; stock: number; total: number }>;

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

const TemplateFieldSchema = z.object({
  key: z.string().min(1),
  label: z.string().min(1),
  kind: z.enum(["text", "number", "date", "select", "checkbox"]),
  required: z.boolean().optional(),
  options: z.array(z.string()).optional(),
});

const TemplateCreateSchema = z.object({
  name: z.string().min(1),
  category: z.string().min(1),
  fields: z.array(TemplateFieldSchema),
});

type TemplateCreateInput = z.infer<typeof TemplateCreateSchema>;

/* =========================
   TEMPLATES: LIST
========================= */

export function templatesList() {
  return db
    .prepare(
      `
      SELECT id, name, category, created_at
      FROM templates
      ORDER BY created_at DESC
    `
    )
    .all();
}

/* =========================
   TEMPLATES: GET
========================= */
export function templatesGet(id: string) {
  const row = db
    .prepare(
      `SELECT id, name, category, fields_json, created_at
       FROM templates
       WHERE id = ?`
    )
    .get(id) as
    | {
        id: string;
        name: string;
        category: string;
        fields_json: string;
        created_at: string;
      }
    | undefined;

  if (!row) return null;

  return {
    id: row.id,
    name: row.name,
    category: row.category,
    created_at: row.created_at,
    fields: JSON.parse(row.fields_json) as Array<{
      key: string;
      label: string;
      kind: "text" | "number" | "date" | "select" | "checkbox";
      required?: boolean;
      options?: string[];
    }>,
  };
}

/* =========================
   TEMPLATES: DELETE
========================= */

export function templatesDelete(id: string) {
  db.prepare(`DELETE FROM templates WHERE id = ?`).run(id);
  return { ok: true as const };
}
/* =========================
   TEMPLATES: CREATE
========================= */

export function templatesCreate(input: TemplateCreateInput) {
  const parsed = TemplateCreateSchema.parse(input);

  const id = crypto.randomUUID();
  const now = new Date().toISOString();

  db.prepare(
    `
    INSERT INTO templates (id, name, category, fields_json, created_at)
    VALUES (?, ?, ?, ?, ?)
  `
  ).run(id, parsed.name, parsed.category, JSON.stringify(parsed.fields), now);

  return { ok: true as const, id };
}

