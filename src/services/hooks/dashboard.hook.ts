"use client";

import { useQuery } from "@tanstack/react-query";
import { getDashboardOverview } from "../api/dashboard.api";

export function useGetDashboardOverview() {
  return useQuery({
    queryKey: ["dashboard", "overview"],
    queryFn: getDashboardOverview,
  });
}
