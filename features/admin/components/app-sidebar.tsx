"use client";

import { type ComponentProps } from "react";
import Link from "next/link";
import {
  IconCalendarEvent,
  IconDownload,
  IconLayoutDashboard,
  IconStar,
} from "@tabler/icons-react";
import { Film } from "lucide-react";

import { NavUser } from "@/features/admin/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const data = {
  menu: [
    {
      title: "Overview",
      url: "/dashboard",
      icon: IconLayoutDashboard,
    },
    {
      title: "Downlist",
      url: "/dashboard/downlist",
      icon: IconDownload,
      badge: "3",
    },
    {
      title: "Speweek",
      url: "/dashboard/speweek",
      icon: IconCalendarEvent,
    },
    {
      title: "Reviews",
      url: "/dashboard/reviews",
      icon: IconStar,
    },
  ],
};

export function AppSidebar({ ...props }: ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <Link href="/">
                <Film className="size-5! text-indigo-500" />
                <span className="text-base font-semibold">SheetR</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {data.menu.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                  {item.badge && (
                    <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
