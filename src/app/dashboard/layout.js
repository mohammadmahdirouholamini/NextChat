// app/dashboard/layout.jsx

"use client";

import { useState } from "react";
import { SideBar } from "@/components/sidebar/SideBar";

export default function DashboardLayout({ children }) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <SideBar isCollapsed={isSidebarCollapsed} toggleSidebar={toggleSidebar} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
}
