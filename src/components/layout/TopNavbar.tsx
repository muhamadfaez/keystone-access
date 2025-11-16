import React from 'react';
import { Sidebar } from "@/components/ui/sidebar";
import { Notifications } from "./Notifications";
import { UserNav } from "./UserNav";
import { ThemeToggle } from '../ThemeToggle';
export function TopNavbar() {
  return (
    <header className="sticky top-0 z-30 border-b bg-background/80 backdrop-blur-sm">
      <div className="flex h-16 items-center px-4 sm:px-6 lg:px-8">
        <Sidebar.Trigger />
        <div className="flex-1" />
        <div className="flex items-center space-x-2">
          <Notifications />
          <ThemeToggle />
          <UserNav />
        </div>
      </div>
    </header>
  );
}