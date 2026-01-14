import { NavLink, Outlet } from "react-router-dom";
import "./layout.css";

/* =========================
   LAYOUT (TOPBAR + SIDEBAR)
========================= */

export default function Layout() {
  return (
    <div className="app-shell">
      {/* =========================
         TOPBAR
      ========================= */}
      <header className="app-topbar">
        <div className="brand">
          <div className="brand-badge" />
          <div className="brand-title">
            <strong>Miguel Valdez</strong>
            <span>Mandatario del automotor</span>
          </div>
        </div>

        <div className="page-title">TRÁMITES Y STOCK</div>

        {/* =========================
           KPI RÁPIDOS (por ahora fijos)
           Luego los conectamos al backend
        ========================= */}
        <div className="quick-stats">
          <div className="kpi">
            <div className="label">Formularios en stock</div>
            <div className="value">—</div>
          </div>
          <div className="kpi">
            <div className="label">Trámites en proceso</div>
            <div className="value">—</div>
          </div>
        </div>
      </header>

      {/* =========================
         SIDEBAR
      ========================= */}
      <aside className="sidebar">
        <div className="sidebar-section">
          <div className="sidebar-header">Navegación</div>
          <div className="sidebar-body">
            <NavLink to="/" style={{ textDecoration: "none" }}>
              {({ isActive }) => (
                <button className={`sb-btn ${isActive ? "" : "secondary"}`}>
                  Dashboard <span>📊</span>
                </button>
              )}
            </NavLink>

            <NavLink to="/stock" style={{ textDecoration: "none" }}>
              {({ isActive }) => (
                <button className={`sb-btn ${isActive ? "" : "secondary"}`}>
                  Stock formularios <span>📦</span>
                </button>
              )}
            </NavLink>

            <button
              className="sb-btn secondary"
              onClick={() => alert("Trámites: lo hacemos en el Paso 3")}
            >
              Iniciar trámite <span>🧾</span>
            </button>

            <button
              className="sb-btn secondary"
              onClick={() => alert("Trámites en proceso: lo hacemos en el Paso 3")}
            >
              Trámites (proceso/terminado) <span>✅</span>
            </button>
          </div>
        </div>

        <div className="sidebar-section">
          <div className="sidebar-header">Acciones rápidas</div>
          <div className="sidebar-body">
            <NavLink to="/stock" style={{ textDecoration: "none" }}>
              <button className="sb-btn">
                Cargar formulario <span>➕</span>
              </button>
            </NavLink>

            <button
              className="sb-btn danger"
              onClick={() => alert("Borrar/Reset: opcional (no lo hacemos por ahora)")}
            >
              Acción peligrosa <span>⚠️</span>
            </button>
          </div>
        </div>

        <div className="muted" style={{ fontSize: 12, marginTop: 8 }}>
          UI estilo “programa de escritorio”. Después conectamos DB y métricas reales.
        </div>
      </aside>

      {/* =========================
         MAIN CONTENT
      ========================= */}
      <main className="main">
        <Outlet />
      </main>
    </div>
  );
}
