export interface ProductGalleryItem {
  url: string;
  publicId: string;
}

export interface ProductPackOption {
  label: string;
  price: number;
  originalPrice?: number;
}

export interface ProductCategorySummary {
  id: string;
  name: string;
  slug: string;
}

export interface ApiProduct {
  id: string;
  name: string;
  slug: string;
  shortTag: string;
  badge: string | null;
  categoryId: string;
  category: ProductCategorySummary;
  price: number;
  originalPrice: number | null;
  unit: string;
  stock: number;
  imageUrl: string | null;
  gallery: ProductGalleryItem[];
  deliveryDays: string;
  shelfLife: string;
  origin: string;
  description: string;
  highlights: string[];
  ingredients: string[];
  packOptions: ProductPackOption[];
  rating: number;
  reviewCount: number;
  isFeatured: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type ProductSortBy =
  | "popular"
  | "newest"
  | "oldest"
  | "price_asc"
  | "price_desc"
  | "rating_desc"
  | "name_asc";

export interface GetProductsParams {
  searchTerm?: string;
  categoryId?: string;
  categorySlug?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  onlyDiscounted?: boolean;
  isFeatured?: boolean;
  isActive?: boolean;
  page?: number;
  limit?: number;
  sortBy?: ProductSortBy;
}

export interface CreateProductPayload {
  name: string;
  slug?: string;
  shortTag?: string;
  badge?: string | null;
  categoryId: string;
  price: number;
  originalPrice?: number | null;
  unit?: string;
  stock?: number;
  deliveryDays?: string;
  shelfLife?: string;
  origin?: string;
  description: string;
  highlights?: string[];
  ingredients?: string[];
  packOptions?: ProductPackOption[];
  isFeatured?: boolean;
  isActive?: boolean;
}

export type UpdateProductPayload = Partial<CreateProductPayload>;

export interface RemoveGalleryImagePayload {
  publicId: string;
}
