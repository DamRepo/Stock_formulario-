import { useEffect, useMemo, useState } from "react";

/* =========================
   TIPOS
========================= */

type StockItem = {
  id: string;
  formType: string; // "08", "12", etc
  serial: string; // 12 dígitos
  status: "stock" | "used" | "sold";
  createdAt: string;
};

/* =========================
   HELPERS: SERIAL
========================= */

function onlyDigits(s: string) {
  return s.replace(/\D/g, "");
}

function formatSerial(serial: string, length = 12) {
  const d = onlyDigits(serial).slice(0, length);
  return d.padStart(length, "0");
}

/* =========================
   STOCK PAGE
========================= */

export default function StockPage() {
  /* =========================
     STATE
  ========================= */
  const [formType, setFormType] = useState("08");
  const [serialInput, setSerialInput] = useState("");
  const [items, setItems] = useState<StockItem[]>([]);
  const [q, setQ] = useState("");

  // Panel series por tipo (abajo)
  const [serialPanelOpen, setSerialPanelOpen] = useState(false);

  /* =========================
     EFFECT: LOAD ON MOUNT
  ========================= */
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const data = await window.api.stock.list();
        if (!cancelled) setItems(data);
      } catch (err) {
        console.error("Error loading stock:", err);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  /* =========================
     HELPERS: REFRESH
  ========================= */
  async function refresh() {
    const data = await window.api.stock.list();
    setItems(data);
  }

  /* =========================
     DERIVADOS
  ========================= */
  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return items;
    return items.filter((i) => {
      return (
        i.formType.toLowerCase().includes(term) ||
        i.serial.toLowerCase().includes(term) ||
        i.status.toLowerCase().includes(term)
      );
    });
  }, [items, q]);

  const byType = useMemo(() => {
    const map = new Map<string, { total: number; stock: number; sold: number }>();
    for (const it of items) {
      const key = it.formType;
      const cur = map.get(key) ?? { total: 0, stock: 0, sold: 0 };
      cur.total += 1;
      if (it.status === "stock") cur.stock += 1;
      if (it.status === "sold") cur.sold += 1;
      map.set(key, cur);
    }
    return Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  }, [items]);

  const stockCount = useMemo(() => items.filter((i) => i.status === "stock").length, [items]);

  // Series por tipo (para el panel)
  const serialsByType = useMemo(() => {
    const map = new Map<string, string[]>();

    for (const it of items) {
      const arr = map.get(it.formType) ?? [];
      arr.push(it.serial);
      map.set(it.formType, arr);
    }

    // Ordenar seriales dentro de cada tipo
    for (const [k, arr] of map.entries()) {
      arr.sort((a, b) => a.localeCompare(b));
      map.set(k, arr);
    }

    // Ordenar tipos
    return Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  }, [items]);

  /* =========================
     ACCIONES
  ========================= */

  const handleAddOne = async () => {
    const typeClean = formType.trim();
    const serial = formatSerial(serialInput, 12);

    if (!typeClean) {
      alert("Ingresá tipo de formulario (ej: 08, 12).");
      return;
    }

    if (onlyDigits(serial).length < 12) {
      alert("La serie debe tener al menos 12 dígitos (se completa con ceros).");
      return;
    }

    const exists = items.some((x) => x.formType === typeClean && x.serial === serial);
    if (exists) {
      alert(`Ya existe ${typeClean} N° ${serial}`);
      return;
    }

    try {
      await window.api.stock.add({ formType: typeClean, serial });
      setSerialInput("");
      await refresh();
    } catch (err) {
      console.error(err);
      alert("No se pudo guardar en la DB. Revisá la consola.");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await window.api.stock.delete(id);
      await refresh();
    } catch (err) {
      console.error(err);
      alert("No se pudo borrar. Revisá la consola.");
    }
  };

  const handleSell = async (id: string) => {
    try {
      await window.api.stock.sell(id);
      await refresh();
    } catch (err) {
      console.error(err);
      alert("No se pudo marcar como vendido. Revisá la consola.");
    }
  };

  /* =========================
     UI
  ========================= */

  return (
    <div className="row">
      <div className="card">
        <h1 className="h1">Stock de formularios</h1>
        <div className="muted" style={{ marginTop: 6 }}>
          Carga por numeración (serie). Contadores por tipo (08, 12, etc). Simple y rápido.
        </div>
      </div>

      {/* =========================
         DASH STOCK (cards chicas)
      ========================= */}
      <div className="grid-3">
        <div className="card" style={{ padding: 12 }}>
          <div className="muted" style={{ fontSize: 11, fontWeight: 900, textTransform: "uppercase" }}>
            F.08
          </div>
          <div style={{ fontSize: 28, fontWeight: 1000, marginTop: 4 }}>
            {String(stockCount).padStart(2, "0")}
          </div>
        </div>

        <div className="card" style={{ padding: 12 }}>
          <div className="muted" style={{ fontSize: 11, fontWeight: 900, textTransform: "uppercase" }}>
            Tipos (F.12)
          </div>
          <div style={{ fontSize: 28, fontWeight: 1000, marginTop: 4 }}>
            {String(byType.length).padStart(2, "0")}
          </div>
        </div>

        <div className="card" style={{ padding: 12 }}>
          <div className="muted" style={{ fontSize: 11, fontWeight: 900, textTransform: "uppercase" }}>
            Total (F.04)
          </div>
          <div style={{ fontSize: 28, fontWeight: 1000, marginTop: 4 }}>
            {String(items.length).padStart(2, "0")}
          </div>
        </div>

        {/* F.13 compacta con botón VER */}
        <div className="card" style={{ padding: 12 }}>
          <div
            className="muted"
            style={{
              fontSize: 11,
              fontWeight: 900,
              textTransform: "uppercase",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 10,
            }}
          >
            <span>F.13</span>

            <button
              className="btn"
              type="button"
              onClick={() => setSerialPanelOpen((v) => !v)}
              style={{
                padding: "6px 10px",
                fontSize: 11,
                fontWeight: 900,
                borderRadius: 10,
              }}
            >
              {serialPanelOpen ? "OCULTAR" : "VER"}
            </button>
          </div>

          <div style={{ fontSize: 28, fontWeight: 1000, marginTop: 4 }}>
            {String(items.length).padStart(2, "0")}
          </div>
        </div>
      </div>

      {/* =========================
         PANEL ABAJO: SERIES POR TIPO
      ========================= */}
      {serialPanelOpen && (
        <div className="card" style={{ marginTop: 12, padding: 14 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
            <div style={{ fontWeight: 1000 }}>Series por tipo</div>
            <button className="btn" type="button" onClick={() => setSerialPanelOpen(false)}>
              Cerrar
            </button>
          </div>

          {serialsByType.length === 0 ? (
            <div className="muted" style={{ marginTop: 10 }}>
              No hay items cargados.
            </div>
          ) : (
            <div style={{ marginTop: 10 }}>
              {serialsByType.map(([type, serials]) => (
                <div key={type} style={{ paddingTop: 10, borderTop: "1px solid rgba(0,0,0,.08)" }}>
                  <div className="muted" style={{ fontSize: 12, fontWeight: 900, textTransform: "uppercase" }}>
                    Tipo (F.{type})
                  </div>

                  <div
                    style={{
                      marginTop: 8,
                      display: "grid",
                      gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                      gap: 8,
                    }}
                  >
                    {serials.map((s) => (
                      <div
                        key={`${type}-${s}`}
                        className="pill"
                        style={{
                          fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
                          justifyContent: "flex-start",
                        }}
                      >
                        Serie: {s}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* =========================
         FORM: CARGAR FORMULARIO
      ========================= */}
      <div className="card">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
          <div>
            <div style={{ fontWeight: 1000 }}>Cargar formulario</div>
            <div className="muted" style={{ fontSize: 13 }}>
              Ejemplo: 08 N° 000000000123 (12 dígitos)
            </div>
          </div>

          <div className="pill">Stock actual: {String(stockCount).padStart(2, "0")}</div>
        </div>

        <div className="row-3" style={{ marginTop: 10 }}>
          <div>
            <div className="muted" style={{ fontSize: 12, fontWeight: 800, textTransform: "uppercase" }}>
              Tipo (08/12/…)
            </div>
            <input className="input" value={formType} onChange={(e) => setFormType(e.target.value)} placeholder="08" />
          </div>

          <div>
            <div className="muted" style={{ fontSize: 12, fontWeight: 800, textTransform: "uppercase" }}>
              Serie (12 dígitos)
            </div>
            <input
              className="input"
              value={serialInput}
              onChange={(e) => setSerialInput(formatSerial(e.target.value, 12))}
              inputMode="numeric"
              placeholder="000000000123"
              maxLength={12}
            />
          </div>

          <div style={{ display: "flex", alignItems: "flex-end", gap: 10 }}>
            <button className="btn primary" onClick={handleAddOne} style={{ width: "100%" }}>
              Agregar
            </button>
          </div>
        </div>
      </div>

      {/* =========================
         FILTRO
      ========================= */}
      <div className="card">
        <div className="row-2">
          <div>
            <div className="muted" style={{ fontSize: 12, fontWeight: 900, textTransform: "uppercase" }}>
              Buscar / filtrar
            </div>
            <input
              className="input"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="08, 000000000123, stock, sold..."
            />
          </div>

          <div>
            <div className="muted" style={{ fontSize: 12, fontWeight: 900, textTransform: "uppercase" }}>
              Resumen por tipo
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 8 }}>
              {byType.length === 0 ? (
                <span className="muted">—</span>
              ) : (
                byType.map(([t, s]) => (
                  <span key={t} className="pill">
                    {t}: {String(s.stock).padStart(2, "0")} stock / {String(s.total).padStart(2, "0")} total
                  </span>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* =========================
         TABLA
      ========================= */}
      <div className="card" style={{ padding: 0 }}>
        <table className="table">
          <thead>
            <tr>
              <th>Tipo</th>
              <th>Serie</th>
              <th>Estado</th>
              <th>Fecha</th>
              <th style={{ width: 260 }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ padding: 14 }} className="muted">
                  No hay items. Cargá un formulario con tipo y serie.
                </td>
              </tr>
            ) : (
              filtered.map((it) => (
                <tr key={it.id}>
                  <td style={{ fontWeight: 1000 }}>{it.formType}</td>
                  <td style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace" }}>
                    {it.serial}
                  </td>
                  <td>
                    <span className="pill">
                      {it.status === "stock" ? "En stock" : it.status === "sold" ? "Vendido" : "Usado"}
                    </span>
                  </td>
                  <td>{new Date(it.createdAt).toLocaleString()}</td>
                  <td>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button className="btn success" onClick={() => handleSell(it.id)}>
                        Vender
                      </button>
                      <button className="btn danger" onClick={() => handleDelete(it.id)}>
                        Borrar
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="muted" style={{ fontSize: 12 }}>
        Nota: ahora esto lee/escribe desde DB via IPC (`window.api.stock.*`).
      </div>
    </div>
  );
}
