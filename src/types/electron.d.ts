export {};

declare global {
  /* =========================
     TYPES: Templates
  ========================= */

  type TemplateField = {
    key: string;
    label: string;
    kind: "text" | "number" | "date" | "select" | "checkbox";
    required?: boolean;
    options?: string[];
  };

  type TemplateCreateInput = {
    name: string;
    category: string;
    fields: TemplateField[];
  };

  type TemplateListItem = {
    id: string;
    name: string;
    category: string;
    created_at: string;
  };

  type TemplateFull = TemplateListItem & {
    fields: TemplateField[];
  };

  /* =========================
     TYPES: Stock
  ========================= */

  type StockItem = {
    id: string;
    formType: string;
    serial: string;
    status: "stock" | "used" | "sold";
    createdAt: string;
  };

  /* =========================
     TYPES: Dashboard
  ========================= */

  type DashboardStats = {
    total: number;
    stock: number;
    sold: number;
    byType: Array<{ formType: string; stock: number; total: number }>;
  };

  /* =========================
     WINDOW API
  ========================= */

  interface Window {
    api: {
      ping: () => string;

      /* =========================
         STOCK
      ========================= */
      stock: {
        list: () => Promise<StockItem[]>;
        add: (input: { formType: string; serial: string }) => Promise<{ ok: true; id: string }>;
        sell: (id: string) => Promise<{ ok: true }>;
        delete: (id: string) => Promise<{ ok: true }>;
      };

      /* =========================
         DASHBOARD
      ========================= */
      dashboard: {
        stats: () => Promise<DashboardStats>;
      };

      /* =========================
         TEMPLATES
      ========================= */
      templates: {
        list: () => Promise<TemplateListItem[]>;
        get: (id: string) => Promise<TemplateFull | null>;
        create: (input: TemplateCreateInput) => Promise<{ ok: true; id: string }>;
        delete: (id: string) => Promise<{ ok: true }>;
      };
    };
  }
}
