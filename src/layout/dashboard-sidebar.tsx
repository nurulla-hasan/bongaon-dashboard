"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { toast } from "sonner";
import { Logo } from "@/components/common/logo";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { adminNavigation } from "@/constants/navigation";
import { getErrorMessage } from "@/lib/error";
import { useLogout } from "@/services";

export function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { mutate: logout, isPending } = useLogout();

  const isItemActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  const handleSignOut = () => {
    logout(undefined, {
      onSuccess: () => {
        toast.success("Signed out");
        router.push("/login");
        router.refresh();
      },
      onError: (err) => {
        toast.error(getErrorMessage(err, "Failed to sign out"));
      },
    });
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="flex h-16 flex-row items-center justify-start border-b px-4 group-data-[collapsible=icon]:justify-center">
        <Logo size="md" href="/dashboard" />
      </SidebarHeader>

      <SidebarContent>
        {adminNavigation.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden">
              {group.label}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="gap-1">
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      size="md"
                      isActive={isItemActive(item.href)}
                      tooltip={item.label}
                      render={<Link href={item.href} />}
                    >
                      <item.icon className="size-4 shrink-0" />
                      <span className="truncate">{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="border-t p-3">
        <Button
          variant="destructive"
          loading={isPending}
          onClick={handleSignOut}
          className="w-full justify-start gap-2 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0"
        >
          <LogOut className="size-4 shrink-0" />
          <span className="group-data-[collapsible=icon]:hidden">Sign Out</span>
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}

export default DashboardSidebar;
