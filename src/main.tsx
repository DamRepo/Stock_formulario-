import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Layout from "./ui/Layout";
import DashboardPage from "./pages/DashboardPage";
import StockPage from "./pages/StockPage";

import "./ui/layout.css";

/* =========================
   ROUTER
========================= */

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/stock" element={<StockPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
