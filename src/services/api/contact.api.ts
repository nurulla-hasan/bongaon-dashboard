import { apiClient } from "@/lib/api-client";
import type {
  ApiContactMessage,
  ApiResponse,
  GetContactsParams,
  ReplyContactPayload,
  UpdateContactStatusPayload,
} from "@/types";

export function getContacts(params?: GetContactsParams) {
  return apiClient<ApiResponse<ApiContactMessage[]>>("/contacts", {
    query: params,
  });
}

export function getContactById(id: string) {
  return apiClient<ApiResponse<ApiContactMessage>>(`/contacts/${id}`);
}

export function updateContactStatus(
  id: string,
  payload: UpdateContactStatusPayload,
) {
  return apiClient<ApiResponse<ApiContactMessage>>(`/contacts/${id}/status`, {
    method: "PATCH",
    body: payload,
  });
}

export function replyContact(id: string, payload: ReplyContactPayload) {
  return apiClient<ApiResponse<ApiContactMessage>>(`/contacts/${id}/reply`, {
    method: "POST",
    body: payload,
  });
}

export function deleteContact(id: string) {
  return apiClient<ApiResponse<null>>(`/contacts/${id}`, {
    method: "DELETE",
  });
}
