import React from "react";
import { Outlet } from "react-router-dom";
import { Sidebar, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { TopNavbar } from "./TopNavbar";
import { cn } from "@/lib/utils";
export function AppLayout(): JSX.Element {
  return (
    <SidebarProvider>
      <div className={cn("relative min-h-screen bg-background")}>
        <AppSidebar />
        <TopNavbar />
        <Sidebar.MainContent className="pt-16">
          <Outlet />
        </Sidebar.MainContent>
      </div>
    </SidebarProvider>
  );
}