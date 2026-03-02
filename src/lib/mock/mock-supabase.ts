/* eslint-disable @typescript-eslint/no-explicit-any */
import { DEMO_USER_ID, DEMO_EMAIL, executeQuery, type QueryOptions } from "./database";

// ── Mock Query Builder ─────────────────────────────────────────────
// Mimics Supabase's chainable query API.
// In "server" mode, executes directly on the global in-memory DB.
// In "client" mode, POSTs to /api/mock/data so data lives on the server.

class MockQueryBuilder {
  private _table: string;
  private _op: "select" | "insert" | "update" | "delete" = "select";
  private _data: any = null;
  private _filters: { col: string; val: any }[] = [];
  private _order: { col: string; ascending: boolean } | null = null;
  private _limit: number | null = null;
  private _single = false;
  private _returnData = false;
  private _isServer: boolean;

  constructor(table: string, isServer: boolean) {
    this._table = table;
    this._isServer = isServer;
  }

  select(_cols = "*") {
    if (this._op === "insert" || this._op === "update") {
      this._returnData = true;
    } else {
      this._op = "select";
    }
    return this;
  }

  insert(data: any) {
    this._op = "insert";
    this._data = data;
    return this;
  }

  update(data: any) {
    this._op = "update";
    this._data = data;
    return this;
  }

  delete() {
    this._op = "delete";
    return this;
  }

  eq(col: string, val: any) {
    this._filters.push({ col, val });
    return this;
  }

  order(col: string, opts?: { ascending?: boolean }) {
    this._order = { col, ascending: opts?.ascending ?? true };
    return this;
  }

  limit(n: number) {
    this._limit = n;
    return this;
  }

  single() {
    this._single = true;
    return this;
  }

  // Make the builder thenable so `await` works
  then(
    resolve: (value: any) => any,
    reject?: (reason: any) => any
  ) {
    return this._execute().then(resolve, reject);
  }

  private async _execute(): Promise<{ data: any; error: any }> {
    const opts: QueryOptions = {
      table: this._table as any,
      op: this._op,
      data: this._data,
      filters: this._filters,
      order: this._order,
      limit: this._limit,
      single: this._single,
      returnData: this._returnData,
    };

    if (this._isServer) {
      return executeQuery(opts);
    }

    // Client mode: proxy through the mock API
    try {
      const res = await fetch("/api/mock/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(opts),
      });
      return await res.json();
    } catch (err) {
      return { data: null, error: { message: String(err) } };
    }
  }
}

// ── Mock Storage ───────────────────────────────────────────────────

function createMockStorage() {
  return {
    from(_bucket: string) {
      return {
        upload(_path: string, _file: any) {
          return Promise.resolve({ data: { path: _path }, error: null });
        },
        getPublicUrl(path: string) {
          return {
            data: {
              publicUrl: `https://placehold.co/600x400/1a1a1a/E8FF5A?text=${encodeURIComponent(path.split("/").pop() || "Photo")}`,
            },
          };
        },
      };
    },
  };
}

// ── Create Mock Client ─────────────────────────────────────────────

const DEMO_USER = {
  id: DEMO_USER_ID,
  email: DEMO_EMAIL,
  app_metadata: {},
  user_metadata: { full_name: "Demo User" },
  aud: "authenticated",
  created_at: new Date().toISOString(),
};

export function createMockClient(mode: "server" | "client") {
  const isServer = mode === "server";

  return {
    auth: {
      getUser: async () => ({ data: { user: DEMO_USER }, error: null }),
      signInWithPassword: async (_creds: any) => ({
        data: { user: DEMO_USER, session: { access_token: "demo" } },
        error: null,
      }),
      signUp: async (_creds: any) => ({
        data: { user: DEMO_USER, session: null },
        error: null,
      }),
      signOut: async () => ({ error: null }),
      exchangeCodeForSession: async (_code: string) => ({
        data: { session: { access_token: "demo" } },
        error: null,
      }),
    },
    from: (table: string) => new MockQueryBuilder(table, isServer),
    storage: createMockStorage(),
    rpc: async (_fn: string, _params?: any) => ({ data: null, error: null }),
  };
}
