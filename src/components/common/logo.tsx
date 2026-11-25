import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({
  className,
  size = "md",
  href = "/dashboard",
}: {
  className?: string;
  size?: "sm" | "md" | "lg";
  href?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center gap-2.5 font-semibold tracking-tight transition-opacity hover:opacity-90",
        className,
      )}
    >
      <div className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-primary font-heading font-black text-primary-foreground shadow-sm">
        B
      </div>

      <span
        className={cn(
          "truncate font-heading font-extrabold tracking-tight text-foreground group-data-[collapsible=icon]:hidden",
          size === "lg" && "text-2xl tracking-tighter",
          size === "md" && "text-lg tracking-tight",
          size === "sm" && "text-base",
        )}
      >
        Bongaon <span className="text-primary">Bazar</span>
      </span>
    </Link>
  );
}
