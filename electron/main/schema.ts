import { z } from "zod";

export const FieldSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  type: z.enum(["text", "number", "date", "textarea", "select", "checkbox"]),
  required: z.boolean().optional().default(false),
  options: z.array(z.string()).optional() // para select
});

export const TemplateSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  category: z.string().min(1),
  fields: z.array(FieldSchema).min(1)
});

export type Template = z.infer<typeof TemplateSchema>;
