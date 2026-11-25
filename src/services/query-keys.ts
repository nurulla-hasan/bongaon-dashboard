export type QueryParams = Record<string, string | number | boolean | undefined>;

export const queryKeys = {
  auth: {
    me: ["auth", "me"] as const,
  },
  categories: {
    all: ["categories"] as const,
    list: (params?: QueryParams) => ["categories", "list", params ?? {}] as const,
    detail: (idOrSlug: string) => ["categories", "detail", idOrSlug] as const,
  },
  products: {
    all: ["products"] as const,
    list: (params?: QueryParams) => ["products", "list", params ?? {}] as const,
    detail: (idOrSlug: string) => ["products", "detail", idOrSlug] as const,
  },
  orders: {
    all: ["orders"] as const,
    list: (params?: QueryParams) => ["orders", "list", params ?? {}] as const,
    detail: (id: string) => ["orders", "detail", id] as const,
  },
  reviews: {
    all: ["reviews"] as const,
    list: (params?: QueryParams) => ["reviews", "list", params ?? {}] as const,
  },
  contacts: {
    all: ["contacts"] as const,
    list: (params?: QueryParams) => ["contacts", "list", params ?? {}] as const,
    detail: (id: string) => ["contacts", "detail", id] as const,
  },
  users: {
    all: ["users"] as const,
    list: (params?: QueryParams) => ["users", "list", params ?? {}] as const,
    detail: (id: string) => ["users", "detail", id] as const,
    stats: ["users", "dashboard-stats"] as const,
  },
  settings: {
    detail: ["settings"] as const,
  },
} as const;
