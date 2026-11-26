import type { UserRole, UserStatus } from "./api.types";

export interface ApiUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  phone: string | null;
  imageUrl: string | null;
  emailVerified: boolean;
  createdAt: string;
}

export type UserSortBy = "newest" | "oldest" | "name_asc" | "name_desc";

export interface GetUsersParams {
  searchTerm?: string;
  role?: UserRole;
  status?: UserStatus;
  page?: number;
  limit?: number;
  sortBy?: UserSortBy;
}

export interface CreateAdminPayload {
  name: string;
  email: string;
  password: string;
  phone?: string | null;
}

export interface UpdateUserStatusPayload {
  status: UserStatus;
}

export interface UpdateUserRolePayload {
  role: UserRole;
}
