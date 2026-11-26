"use client";

import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  deleteContact,
  getContactById,
  getContacts,
  replyContact,
  updateContactStatus,
} from "../api/contact.api";
import type {
  GetContactsParams,
  ReplyContactPayload,
  UpdateContactStatusPayload,
} from "@/types";

export function useGetContacts(params?: GetContactsParams) {
  return useQuery({
    queryKey: ["contacts", params],
    queryFn: () => getContacts(params),
    placeholderData: keepPreviousData,
  });
}

export function useGetContactById(id: string, enabled = true) {
  return useQuery({
    queryKey: ["contacts", id],
    queryFn: () => getContactById(id),
    enabled: Boolean(id) && enabled,
  });
}

export function useUpdateContactStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateContactStatusPayload;
    }) => updateContactStatus(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
    },
  });
}

export function useReplyContact() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: ReplyContactPayload;
    }) => replyContact(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
    },
  });
}

export function useDeleteContact() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteContact,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
    },
  });
}
