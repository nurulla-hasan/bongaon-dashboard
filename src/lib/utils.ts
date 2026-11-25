export { cn } from "cn";

export const getInitials = (name: string): string => {
  if (!name) return "BB";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return (parts[0]?.[0] ?? "B").toUpperCase();
  return `${parts[0]?.[0] ?? ""}${parts[1]?.[0] ?? ""}`.toUpperCase();
};

export const formatCurrencyBDT = (amount: number): string => {
  return `৳${amount.toLocaleString("en-US")}`;
};

export const formatDate = (date: string | number | Date): string => {
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return "—";
  return parsed.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};
