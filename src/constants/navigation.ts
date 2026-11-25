import {
  FolderTree,
  LayoutDashboard,
  Mail,
  Package,
  Settings,
  ShoppingBag,
  Star,
  Users,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

export const adminNavigation: NavGroup[] = [
  {
    label: "Overview",
    items: [
      { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    ],
  },
  {
    label: "Storefront",
    items: [
      { label: "Categories", href: "/categories", icon: FolderTree },
      { label: "Products", href: "/products", icon: Package },
      { label: "Orders", href: "/orders", icon: ShoppingBag },
      { label: "Reviews", href: "/reviews", icon: Star },
      { label: "Contacts", href: "/contacts", icon: Mail },
    ],
  },
  {
    label: "Management",
    items: [
      { label: "Users", href: "/users", icon: Users },
      { label: "Settings", href: "/settings", icon: Settings },
    ],
  },
];
