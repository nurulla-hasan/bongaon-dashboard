import { apiClient } from "@/lib/api-client";
import type { ApiDashboardOverview, ApiResponse } from "@/types";

export function getDashboardOverview() {
  return apiClient<ApiResponse<ApiDashboardOverview>>("/dashboard/overview");
}
