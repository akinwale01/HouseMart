"use client";

import { useState } from "react";
import DashboardShell from "../shared/DashboardShell";
import SidebarCustomer from "../../components/SidebarCustomer";
import CustomerNavbar from "../../components/NavbarCustomer";
export default function AgentLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  const toggleSidebar = (): void => {
    setSidebarOpen((prev) => !prev);
  };

  const handleLogout=() => {
    // Custom logout logic for customers can be added here
    console.log("Customer logged out");
  }

  return (
    <DashboardShell
      sidebar={<SidebarCustomer collapsed={!sidebarOpen} toggleCollapse={toggleSidebar} onLogoutClick={handleLogout} />}
      navbar={<CustomerNavbar toggleSidebar={toggleSidebar} />} // ✅ safe now
    >
      {children}
    </DashboardShell>
  );
}