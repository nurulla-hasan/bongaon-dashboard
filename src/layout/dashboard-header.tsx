"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, Settings2 } from "lucide-react";
import { toast } from "sonner";
import { ThemeToggle } from "@/components/common/theme-toggle";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { getInitials } from "@/lib/utils";

const MOCK_ADMIN = {
  name: "Super Admin",
  email: "admin@bongaonbajar.com",
  role: "ADMIN",
};

export function DashboardHeader() {
  const router = useRouter();

  const handleLogout = () => {
    toast.success("Signed out (mock preview)");
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b bg-sidebar px-4 sm:px-6">
      <SidebarTrigger className="shrink-0" />

      <div className="ml-auto flex items-center gap-2">
        <ThemeToggle />

        <DropdownMenu>
          <DropdownMenuTrigger className="cursor-pointer rounded-full outline-hidden focus-visible:ring-3 focus-visible:ring-ring/50">
            <Avatar>
              <AvatarFallback>{getInitials(MOCK_ADMIN.name)}</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-60">
            <DropdownMenuGroup>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col gap-1">
                  <p className="truncate text-sm font-semibold leading-tight">
                    {MOCK_ADMIN.name}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {MOCK_ADMIN.email}
                  </p>
                  <div>
                    <Badge variant="admin">{MOCK_ADMIN.role}</Badge>
                  </div>
                </div>
              </DropdownMenuLabel>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              <DropdownMenuItem
                render={<Link href="/settings" />}
                className="flex cursor-pointer items-center gap-2"
              >
                <Settings2 className="size-4" />
                Settings
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={handleLogout}
              variant="destructive"
              className="flex cursor-pointer items-center gap-2"
            >
              <LogOut className="size-4" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

export default DashboardHeader;
