/* eslint-disable @typescript-eslint/no-explicit-any */

// ── Global in-memory mock database for demo mode ───────────────────
// Persists within the Node.js process (survives hot-reloads in dev)

export const DEMO_USER_ID = "00000000-0000-0000-0000-000000000001";
export const DEMO_EMAIL = "demo@localboost.com";

type Row = Record<string, any>;
type Table =
  | "profiles"
  | "businesses"
  | "competitor_analyses"
  | "strategies"
  | "campaigns"
  | "campaign_posts"
  | "photos";

interface MockDB {
  profiles: Map<string, Row>;
  businesses: Map<string, Row>;
  competitor_analyses: Map<string, Row>;
  strategies: Map<string, Row>;
  campaigns: Map<string, Row>;
  campaign_posts: Map<string, Row>;
  photos: Map<string, Row>;
}

declare global {
  // eslint-disable-next-line no-var
  var __mockDb: MockDB | undefined;
}

function seed(): MockDB {
  const db: MockDB = {
    profiles: new Map(),
    businesses: new Map(),
    competitor_analyses: new Map(),
    strategies: new Map(),
    campaigns: new Map(),
    campaign_posts: new Map(),
    photos: new Map(),
  };
  // Seed demo user
  db.profiles.set(DEMO_USER_ID, {
    id: DEMO_USER_ID,
    email: DEMO_EMAIL,
    full_name: "Demo User",
    avatar_url: null,
    stripe_customer_id: null,
    subscription_status: "pro",
    subscription_id: null,
    subscription_period_end: null,
    photos_used_this_month: 0,
    campaigns_used_this_month: 0,
    usage_reset_date: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });
  return db;
}

export function getDB(): MockDB {
  if (!globalThis.__mockDb) {
    globalThis.__mockDb = seed();
  }
  return globalThis.__mockDb;
}

// ── Helpers ────────────────────────────────────────────────────────

export function generateId(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
}

// ── CRUD Operations ────────────────────────────────────────────────

export interface QueryOptions {
  table: Table;
  op: "select" | "insert" | "update" | "delete";
  data?: any;
  filters?: { col: string; val: any }[];
  order?: { col: string; ascending: boolean } | null;
  limit?: number | null;
  single?: boolean;
  returnData?: boolean;
}

export function executeQuery(opts: QueryOptions): { data: any; error: any } {
  const db = getDB();
  const table = db[opts.table];
  if (!table) return { data: null, error: { message: `Unknown table: ${opts.table}` } };

  switch (opts.op) {
    case "select": {
      let rows = Array.from(table.values());
      if (opts.filters) {
        for (const f of opts.filters) {
          rows = rows.filter((r) => r[f.col] === f.val);
        }
      }
      if (opts.order) {
        const { col, ascending } = opts.order;
        rows.sort((a, b) => {
          const av = String(a[col] ?? "");
          const bv = String(b[col] ?? "");
          return ascending ? av.localeCompare(bv) : bv.localeCompare(av);
        });
      }
      if (opts.limit) rows = rows.slice(0, opts.limit);
      if (opts.single) {
        return rows.length > 0
          ? { data: rows[0], error: null }
          : { data: null, error: null };
      }
      return { data: rows, error: null };
    }

    case "insert": {
      const items = Array.isArray(opts.data) ? opts.data : [opts.data];
      const inserted: Row[] = [];
      for (const item of items) {
        const row = {
          ...item,
          id: item.id || generateId(),
          created_at: item.created_at || new Date().toISOString(),
          updated_at: item.updated_at || new Date().toISOString(),
        };
        table.set(row.id, row);
        inserted.push(row);
      }
      if (opts.returnData || opts.single) {
        return opts.single
          ? { data: inserted[0], error: null }
          : { data: inserted, error: null };
      }
      return { data: inserted, error: null };
    }

    case "update": {
      let rows = Array.from(table.values());
      if (opts.filters) {
        for (const f of opts.filters) {
          rows = rows.filter((r) => r[f.col] === f.val);
        }
      }
      const updated: Row[] = [];
      for (const row of rows) {
        const newRow = { ...row, ...opts.data, updated_at: new Date().toISOString() };
        table.set(newRow.id, newRow);
        updated.push(newRow);
      }
      if (opts.returnData || opts.single) {
        return opts.single
          ? { data: updated[0] ?? null, error: null }
          : { data: updated, error: null };
      }
      return { data: updated, error: null };
    }

    case "delete": {
      let rows = Array.from(table.values());
      if (opts.filters) {
        for (const f of opts.filters) {
          rows = rows.filter((r) => r[f.col] === f.val);
        }
      }
      for (const row of rows) {
        table.delete(row.id);
      }
      return { data: null, error: null };
    }

    default:
      return { data: null, error: { message: "Unknown operation" } };
  }
}
