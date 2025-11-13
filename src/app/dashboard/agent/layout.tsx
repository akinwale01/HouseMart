"use client";

import { useState } from "react";
import DashboardShell from "../shared/DashboardShell";
import SidebarAgent from "../../components/SidebarAgent";
import AgentNavbar from "../../components/NavbarAgent";
export default function AgentLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  const toggleSidebar = (): void => {
    setSidebarOpen((prev) => !prev);
  };

  const handleLogout=() => {
    // Custom logout logic for agents can be added here
    console.log("Agent logged out");
  }

  return (
    <DashboardShell
      sidebar={<SidebarAgent collapsed={!sidebarOpen} toggleCollapse={toggleSidebar} onLogoutClick={handleLogout} />}
      navbar={<AgentNavbar toggleSidebar={toggleSidebar} />} // ✅ safe now
    >
      {children}
    </DashboardShell>
  );
}