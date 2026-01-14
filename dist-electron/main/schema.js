"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TemplateSchema = exports.FieldSchema = void 0;
const zod_1 = require("zod");
exports.FieldSchema = zod_1.z.object({
    id: zod_1.z.string().min(1),
    label: zod_1.z.string().min(1),
    type: zod_1.z.enum(["text", "number", "date", "textarea", "select", "checkbox"]),
    required: zod_1.z.boolean().optional().default(false),
    options: zod_1.z.array(zod_1.z.string()).optional() // para select
});
exports.TemplateSchema = zod_1.z.object({
    id: zod_1.z.string().min(1),
    name: zod_1.z.string().min(1),
    category: zod_1.z.string().min(1),
    fields: zod_1.z.array(exports.FieldSchema).min(1)
});
