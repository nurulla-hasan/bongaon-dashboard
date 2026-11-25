import { Atma } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

const brandLogoFont = Atma({
  subsets: ["latin"],
  weight: ["700"],
  display: "swap",
});

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  href?: string;
}

export function Logo({
  className,
  size = "md",
  showText = true,
  href = "/dashboard",
}: LogoProps) {
  const boxSize =
    size === "lg" ? "size-12" : size === "md" ? "size-10" : "size-8";
  const imageSizes =
    size === "lg" ? "48px" : size === "md" ? "40px" : "32px";

  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center gap-2.5 tracking-tight transition-opacity hover:opacity-90",
        className,
      )}
    >
      <span
        className={cn(
          "relative inline-flex shrink-0 items-center justify-center",
          boxSize,
        )}
      >
        <Image
          src="/images/logo-mark.png"
          alt="Bongaon Bazar"
          fill
          sizes={imageSizes}
          className="object-contain"
          priority
        />
      </span>

      {showText && (
        <span
          className={cn(
            brandLogoFont.className,
            "truncate font-bold tracking-normal group-data-[collapsible=icon]:hidden",
            size === "lg" && "text-2xl",
            size === "md" && "text-xl",
            size === "sm" && "text-base",
          )}
        >
          <span className="text-primary">Bongaon</span>{" "}
          <span className="text-clay">Bazar</span>
        </span>
      )}
    </Link>
  );
}
