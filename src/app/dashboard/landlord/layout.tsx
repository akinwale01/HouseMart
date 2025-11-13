"use client";

import { useState } from "react";
import DashboardShell from "../shared/DashboardShell";
import SidebarIndividualLandlord from "../../components/SidebarIndividualLandlord";
import NavbarIndividualLandlord from "../../components/NavbarIndividualLandlord";
export default function AgentLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  const toggleSidebar = (): void => {
    setSidebarOpen((prev) => !prev);
  };

  const handleLogout=() => {
    // Custom logout logic for landlords can be added here
    console.log("Landlord logged out");
  }

  return (
    <DashboardShell
      sidebar={<SidebarIndividualLandlord collapsed={!sidebarOpen} toggleCollapse={toggleSidebar} onLogoutClick={handleLogout} />}
      navbar={<NavbarIndividualLandlord toggleSidebar={toggleSidebar} />} // ✅ safe now
    >
      {children}
    </DashboardShell>
  );
}