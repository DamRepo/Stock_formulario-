import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

type TemplateListItem = {
  id: string;
  name: string;
  category: string;
  created_at: string;
};

export default function TemplatesPage() {
  const [items, setItems] = useState<TemplateListItem[]>([]);

  async function onDelete(id: string) {
    await window.api.templates.delete(id);
    const data = await window.api.templates.list();
    setItems(data);
  }

  useEffect(() => {
    (async () => {
      const data = await window.api.templates.list();
      setItems(data);
    })();
  }, []);

  return (
    <div style={{ padding: 24 }}>
      <h1>Plantillas</h1>
      <div style={{ marginBottom: 12 }}>
        <Link to="/templates/new">+ Nueva plantilla</Link>
      </div>

      <ul>
        {items.map((t) => (
          <li key={t.id} style={{ marginBottom: 10 }}>
            <b>{t.name}</b> — {t.category} — {new Date(t.created_at).toLocaleString()}
            <button onClick={() => onDelete(t.id)} style={{ marginLeft: 8 }}>
              Borrar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
