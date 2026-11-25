"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { settingApi, type UpdateStoreSettingPayload } from "@/services/api";
import { queryKeys } from "@/services/query-keys";

export function useSettings() {
  return useQuery({
    queryKey: queryKeys.settings.detail,
    queryFn: async () => {
      const res = await settingApi.getSettings();
      return res.data;
    },
  });
}

export function useUpdateSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateStoreSettingPayload) =>
      settingApi.updateSettings(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.settings.detail });
    },
  });
}
