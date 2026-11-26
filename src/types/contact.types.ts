import type { ContactStatus } from "./api.types";

export type ContactSortBy = "newest" | "oldest";

export interface ApiContactMessage {
  id: string;
  name: string;
  phone: string;
  email: string;
  subject: string;
  message: string;
  status: ContactStatus;
  adminReply: string | null;
  repliedAt: string | null;
  repliedById: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface GetContactsParams {
  searchTerm?: string;
  status?: ContactStatus;
  page?: number;
  limit?: number;
  sortBy?: ContactSortBy;
}

export interface UpdateContactStatusPayload {
  status: ContactStatus;
}

export interface ReplyContactPayload {
  subject?: string;
  replyMessage: string;
}
