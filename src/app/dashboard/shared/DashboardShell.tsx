"use client";

import {
  ReactElement,
  ReactNode,
  cloneElement,
  isValidElement,
  useEffect,
  useState,
  useCallback,
} from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";

interface NavbarWithToggleProps {
  toggleSidebar?: () => void;
}
interface SidebarProps {
  collapsed: boolean;
  toggleCollapse: () => void;
  onLogoutClick: () => void;
  user?: { username: string; profilePicture?: string };
}
interface DashboardShellProps {
  children: ReactNode;
  sidebar?: ReactElement<SidebarProps>;
  navbar?: ReactElement<NavbarWithToggleProps>;
  role?: "customer" | "agent" | "landlord";
}

const CustomerSidebar = dynamic(() =>
  import("../../components/SidebarCustomer").then((mod) => mod.default)
);
const CustomerNavbar = dynamic(() =>
  import("../../components/NavbarCustomer").then((mod) => mod.default)
);

const AgentSidebar = dynamic(() =>
  import("../../components/SidebarAgent").then((mod) => mod.default)
);
const AgentNavbar = dynamic(() =>
  import("../../components/NavbarAgent").then((mod) => mod.default)
);

const LandlordSidebar = dynamic(() =>
  import("../../components/SidebarIndividualLandlord").then((mod) => mod.default)
);
const LandlordNavbar = dynamic(() =>
  import("../../components/NavbarIndividualLandlord").then((mod) => mod.default)
);

export default function DashboardShell({
  children,
  sidebar,
  navbar,
  role,
}: DashboardShellProps) {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [userRole, setUserRole] = useState<"customer" | "agent" | "landlord" | null>(
    role || null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [showDashboard, setShowDashboard] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [user, setUser] = useState<{ username: string; profilePicture?: string } | null>(
    null
  );

  const handleForceLogout = useCallback((reason?: string) => {
    console.warn("Logging out:", reason || "Unknown reason");
    localStorage.clear();
    sessionStorage.clear();
    router.replace("/");
  }, [router]);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      const storedRole = localStorage.getItem("userType") || sessionStorage.getItem("userType");

      if (!token || !storedRole) {
        handleForceLogout("No token or role found");
        return;
      }

      setUser(null);
      setUserRole(storedRole as "customer" | "agent" | "landlord");
      setIsLoading(true);
      setShowDashboard(false);

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/get-user`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          handleForceLogout(res.status === 401 ? "Session expired" : "Failed to fetch user");
          return;
        }

        const data = await res.json();

        if (!data?.success || !data?.user) {
          handleForceLogout("Invalid user data");
          return;
        }

        setUser({
          username: data.user.username,
          profilePicture: data.user.profilePicture,
        });

        setTimeout(() => {
          setIsLoading(false);
          setShowDashboard(true);
        }, 700);
      } catch (err) {
        console.error("Error fetching user:", err);
        handleForceLogout("Network or server error");
      }
    };

    fetchUser();
  }, [handleForceLogout]);

  if (isLoading || !userRole || !showDashboard) {
    return (
      <div className="relative min-h-screen flex flex-col items-center justify-center bg-linear-to-br from-purple-500 via-pink-500 to-orange-400 overflow-hidden text-white">
        <div className="bg-white/20 backdrop-blur-md rounded-xl shadow-2xl p-10 flex flex-col items-center gap-4 animate-pulse">
          <div className="w-16 h-16 rounded-full border-4 border-white border-t-transparent animate-spin"></div>
          <p className="text-xl font-bold">Loading your dashboard...</p>
          <p className="text-sm text-white/90 text-center">
            Sit tight! We&apos;re preparing an amazing experience for you ✨
          </p>
        </div>
      </div>
    );
  }

  const handleLogoutClick = () => setShowLogoutModal(true);

  const commonSidebarProps: SidebarProps = {
    collapsed,
    toggleCollapse: () => setCollapsed((prev) => !prev),
    onLogoutClick: handleLogoutClick,
    user: user || undefined,
  };

  let resolvedSidebar = sidebar;
  let resolvedNavbar = navbar;

  switch (userRole) {
    case "agent":
      resolvedSidebar = resolvedSidebar || <AgentSidebar {...commonSidebarProps} />;
      resolvedNavbar = resolvedNavbar || <AgentNavbar />;
      break;
    case "landlord":
      resolvedSidebar = resolvedSidebar || <LandlordSidebar {...commonSidebarProps} />;
      resolvedNavbar = resolvedNavbar || <LandlordNavbar />;
      break;
    case "customer":
    default:
      resolvedSidebar = resolvedSidebar || <CustomerSidebar {...commonSidebarProps} />;
      resolvedNavbar = resolvedNavbar || <CustomerNavbar />;
      break;
  }

  const navbarWithToggle = isValidElement(resolvedNavbar)
    ? cloneElement(resolvedNavbar, { toggleSidebar: () => setIsSidebarOpen((prev) => !prev) })
    : resolvedNavbar;

  const sidebarWithProps = isValidElement(resolvedSidebar)
    ? cloneElement(resolvedSidebar, commonSidebarProps)
    : resolvedSidebar;

  return (
    <div className="flex min-h-screen bg-linear-to-br from-purple-50 via-pink-50 to-orange-50 text-gray-800 dark:text-gray-100 overflow-hidden">
      <aside
        className={`fixed top-0 left-0 z-50 h-screen transform transition-all duration-300 ease-in-out
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0
        ${collapsed ? "w-20" : "w-64"}
        bg-white/70 dark:bg-gray-900/70 border-r border-gray-200 dark:border-gray-700 shadow-lg backdrop-blur-md`}
      >
        {sidebarWithProps}
      </aside>

      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      <div
        className={`flex flex-col flex-1 min-h-screen transition-all duration-300 ${
          !collapsed ? "lg:pl-64" : "lg:pl-20"
        }`}
      >
        <header className="sticky top-0 z-30 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 flex items-center justify-between shadow-md">
          {navbarWithToggle}
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 grid gap-6 bg-linear-to-tr from-white via-purple-50 to-pink-50 transition-colors max-w-[1440px] mx-auto w-full">
          {children}
        </main>
      </div>

      {showLogoutModal && (
        <div className="fixed inset-0 flex items-center justify-center z-[999]">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-80 text-center z-[1000] border border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold mb-3 text-gray-900 dark:text-gray-100">
              Confirm Logout
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Are you sure you want to log out?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => handleForceLogout("Manual logout")}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition cursor-pointer"
              >
                Log Out
              </button>
              <button
                onClick={() => setShowLogoutModal(false)}
                className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}