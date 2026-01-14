import { useState } from "react";
import { useNavigate } from "react-router-dom";

/* =========================
   PAGE: NewTemplatePage
========================= */

export default function NewTemplatePage() {
  const nav = useNavigate();

  /* =========================
     STATE
  ========================= */
  const [name, setName] = useState("Presupuesto");
  const [category, setCategory] = useState("Ventas");

  /* =========================
     FIELDS (MVP)
     Ojo: usa key/kind (no id/type)
  ========================= */
  const fields: TemplateField[] = [
    { key: "cliente", label: "Cliente", kind: "text", required: true },
    { key: "fecha", label: "Fecha", kind: "date", required: true },
    { key: "total", label: "Total", kind: "number", required: true },
  ];

  /* =========================
     SUBMIT
  ========================= */
  async function create() {
    await window.api.templates.create({
      name,
      category,
      fields,
    });

    nav("/templates");
  }

  return (
    <div style={{ padding: 24 }}>
      <h1>Nueva Plantilla</h1>

      <div style={{ display: "grid", gap: 8, maxWidth: 420 }}>
        <label>
          Nombre
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ width: "100%" }}
          />
        </label>

        <label>
          Categoría
          <input
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={{ width: "100%" }}
          />
        </label>

        <button onClick={create} style={{ marginTop: 12 }}>
          Crear
        </button>
      </div>

      <div style={{ marginTop: 16, opacity: 0.8 }}>
        <b>Campos que se crearán (por ahora fijos):</b>
        <ul>
          {fields.map((f) => (
            <li key={f.key}>
              {f.label} — <code>{f.kind}</code> {f.required ? "(requerido)" : ""}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
