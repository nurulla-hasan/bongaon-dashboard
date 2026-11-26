export interface ReviewProductSummary {
  id: string;
  name: string;
  slug: string;
}

export interface ApiReview {
  id: string;
  productId: string;
  product: ReviewProductSummary;
  userId: string | null;
  customerName: string;
  location: string;
  rating: number;
  comment: string;
  isApproved: boolean;
  createdAt: string;
  updatedAt: string;
}

export type ReviewSortBy = "newest" | "oldest" | "rating_desc" | "rating_asc";

export interface GetReviewsParams {
  searchTerm?: string;
  productId?: string;
  productSlug?: string;
  rating?: number;
  isApproved?: boolean;
  page?: number;
  limit?: number;
  sortBy?: ReviewSortBy;
}

export interface UpdateReviewPayload {
  isApproved: boolean;
}
