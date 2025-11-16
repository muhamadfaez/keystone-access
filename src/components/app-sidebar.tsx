import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Home, KeyRound, Users, BarChart3, Settings, ClipboardCheck, KeySquare, History, DoorOpen } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { AppLogo } from "./layout/AppLogo";
import { useAuthStore } from "@/stores/authStore";
const navItems = [
  { href: "/", label: "Dashboard", icon: Home, adminOnly: false },
  { href: "/keys", label: "Key Inventory", icon: KeyRound, adminOnly: true },
  { href: "/my-keys", label: "My Keys", icon: KeySquare, adminOnly: false },
  { href: "/users", label: "Users", icon: Users, adminOnly: true },
  { href: "/rooms", label: "Rooms", icon: DoorOpen, adminOnly: true },
  { href: "/requests", label: "Key Requests", icon: ClipboardCheck, adminOnly: false },
  { href: "/reports", label: "Reports", icon: BarChart3, adminOnly: true },
  { href: "/log", label: "Transaction Log", icon: History, adminOnly: true },
  { href: "/settings", label: "Settings", icon: Settings, adminOnly: true },
];
export function AppSidebar(): JSX.Element {
  const location = useLocation();
  const user = useAuthStore((state) => state.user);
  const filteredNavItems = navItems.filter(item => {
    if (item.adminOnly && user?.role !== 'admin') return false;
    // Business Rule: "My Keys" is a user-centric view and is not relevant for admins
    // who manage the entire inventory. Hiding it simplifies the admin interface.
    if (item.href === '/my-keys' && user?.role === 'admin') return false;
    return true;
  });
  return (
    <Sidebar collapsible="icon" variant="inset">
      <SidebarHeader>
        <div className="flex items-center gap-2.5">
          <AppLogo className="h-8 w-8 text-primary" />
          <span className="text-lg font-semibold font-display tracking-tight group-data-[state=collapsed]:hidden">KeyTrack</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {filteredNavItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={location.pathname === item.href}
                tooltip={item.label}
              >
                <NavLink to={item.href}>
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}