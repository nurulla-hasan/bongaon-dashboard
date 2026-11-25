import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type HeadingAlignment = "left" | "center";
type HeadingVariant = "plain" | "brand";

interface SectionHeadingProps {
  badge?: string;
  eyebrow?: string;
  title: ReactNode;
  description?: string;
  alignment?: HeadingAlignment;
  variant?: HeadingVariant;
  as?: "h1" | "h2" | "h3" | "h4";
  constrain?: boolean;
  className?: string;
  children?: ReactNode;
}

const headingSizes: Record<NonNullable<SectionHeadingProps["as"]>, string> = {
  h1: "text-2xl font-bold sm:text-3xl",
  h2: "text-xl font-semibold sm:text-2xl",
  h3: "text-lg font-semibold sm:text-xl",
  h4: "text-base font-semibold",
};

export function SectionHeading({
  badge,
  eyebrow,
  title,
  description,
  alignment = "left",
  variant = "plain",
  as: Tag = "h3",
  constrain = false,
  className,
  children,
}: SectionHeadingProps) {
  const hasKicker = Boolean(badge || eyebrow);

  return (
    <div
      className={cn(
        constrain && !children && "max-w-2xl",
        alignment === "center" ? "mx-auto text-center" : "text-left",
        children && "flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between",
        className,
      )}
    >
      <div className="min-w-0 space-y-0.5">
        {eyebrow && (
          <p className="inline-flex items-center gap-2 text-xs font-medium tracking-widest text-primary uppercase">
            <span className="size-1.5 rounded-full bg-primary" aria-hidden />
            {eyebrow}
          </p>
        )}

        {badge && <Badge variant="secondary">{badge}</Badge>}

        <Tag
          className={cn(
            hasKicker && "pt-1",
            "font-heading leading-tight tracking-tight",
            variant === "brand" ? "text-primary uppercase" : "text-foreground",
            headingSizes[Tag],
          )}
        >
          {title}
        </Tag>

        {description && (
          <p className="text-sm leading-5 text-muted-foreground">{description}</p>
        )}
      </div>

      {children}
    </div>
  );
}
