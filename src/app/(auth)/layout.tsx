import type { ReactNode } from "react";
import { Package, ShieldCheck, ShoppingBag } from "lucide-react";
import { Logo } from "@/components/common/logo";
import { ThemeToggle } from "@/components/common/theme-toggle";
import { Badge } from "@/components/ui/badge";

const highlights = [
  {
    icon: ShoppingBag,
    title: "COD Order Pipeline",
    description: "Track pending, in-transit, and delivered orders across Bangladesh.",
  },
  {
    icon: Package,
    title: "Catalog & Inventory",
    description: "Manage categories, pack pricing, and low-stock alerts in real time.",
  },
  {
    icon: ShieldCheck,
    title: "Verified Moderation",
    description: "Approve customer reviews and respond to inquiries from one place.",
  },
] as const;

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <aside className="hidden flex-col justify-between border-r border-border bg-sidebar p-10 lg:flex">
        <Logo size="lg" href="/login" />

        <div className="my-auto max-w-lg space-y-8 py-12">
          <div className="space-y-3">
            <Badge variant="secondary">Admin Workspace</Badge>
            <h1 className="font-heading text-3xl leading-tight font-bold tracking-tight text-foreground">
              Run <span className="text-primary">Bongaon Bazar</span> from one calm,
              reliable dashboard.
            </h1>
            <p className="text-sm leading-6 text-muted-foreground">
              Monitor Cash on Delivery orders, village-fresh inventory, customer
              reviews, and storefront settings without clutter.
            </p>
          </div>

          <div className="grid gap-3">
            {highlights.map((item) => (
              <div
                key={item.title}
                className="flex items-start gap-3.5 rounded-xl border border-border bg-card/70 p-4"
              >
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <item.icon className="size-4" />
                </span>
                <div className="space-y-0.5">
                  <p className="text-sm font-semibold text-foreground">{item.title}</p>
                  <p className="text-xs leading-5 text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} Bongaon Bazar. Internal Admin Portal.
        </p>
      </aside>

      <main className="relative flex min-h-screen flex-col items-center justify-center bg-muted/30 p-4 sm:p-8">
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>

        <div className="mb-6 lg:hidden">
          <Logo size="lg" href="/login" />
        </div>

        {children}
      </main>
    </div>
  );
}
