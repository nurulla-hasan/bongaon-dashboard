export interface ApiCategory {
  id: string;
  name: string;
  slug: string;
  subtitle: string;
  imageUrl: string | null;
  sortOrder: number;
  isActive: boolean;
  showOnHome: boolean;
  _count?: {
    products: number;
  };
  createdAt: string;
  updatedAt: string;
}

export type CategorySortBy =
  | "sort_order"
  | "newest"
  | "oldest"
  | "name_asc"
  | "name_desc";

export interface GetCategoriesParams {
  searchTerm?: string;
  isActive?: boolean;
  showOnHome?: boolean;
  page?: number;
  limit?: number;
  sortBy?: CategorySortBy;
}

export interface CreateCategoryPayload {
  name: string;
  slug?: string;
  subtitle?: string;
  sortOrder?: number;
  isActive?: boolean;
  showOnHome?: boolean;
}

export interface UpdateCategoryPayload {
  name?: string;
  slug?: string;
  subtitle?: string;
  sortOrder?: number;
  isActive?: boolean;
  showOnHome?: boolean;
}
