/* =========================
   DASHBOARD
========================= */

export default function DashboardPage() {
  return (
    <div className="row">
      <div className="card">
        <h1 className="h1">Dashboard</h1>
        <div className="muted" style={{ marginTop: 6 }}>
          Resumen rápido de stock y trámites. (Ahora está “en maqueta”; en el Paso 2 lo conectamos.)
        </div>
      </div>

      {/* =========================
         KPIs
      ========================= */}
      <div className="grid-3">
        <div className="card">
          <div className="muted" style={{ fontSize: 12, textTransform: "uppercase", fontWeight: 800 }}>
            Formularios 
          </div>
          <div style={{ fontSize: 36, fontWeight: 1000, marginTop: 6 }}>—</div>
        </div>

        <div className="card">
          <div className="muted" style={{ fontSize: 12, textTransform: "uppercase", fontWeight: 800 }}>
            Trámites en proceso
          </div>
          <div style={{ fontSize: 36, fontWeight: 1000, marginTop: 6 }}>—</div>
        </div>

        <div className="card">
          <div className="muted" style={{ fontSize: 12, textTransform: "uppercase", fontWeight: 800 }}>
            Trámites terminados / Pago
          </div>
          <div style={{ fontSize: 36, fontWeight: 1000, marginTop: 6 }}>—</div>
        </div>
      </div>

      {/* =========================
         SECCIÓN: Reporte (semana/mes/año)
      ========================= */}
      <div className="card">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
          <div>
            <div style={{ fontWeight: 1000 }}>Vista temporal</div>
            <div className="muted" style={{ fontSize: 13 }}>
              Semana / Mes / Año (lo conectamos cuando estén los trámites)
            </div>
          </div>

          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn">Semana</button>
            <button className="btn">Mes</button>
            <button className="btn">Año</button>
          </div>
        </div>
      </div>
    </div>
  );
}
