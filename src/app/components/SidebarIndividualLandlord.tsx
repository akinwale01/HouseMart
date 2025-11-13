"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Home,
  Heart,
  FileText,
  Settings,
  MessageSquare,
  HelpCircle,
  LogOut,
  Star,
  Building2,
  Calendar,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface UserData {
  username: string;
  profilePicture?: string;
}

interface IndividualLandlordSidebarProps {
  collapsed: boolean;
  toggleCollapse: () => void;
  onLogoutClick: () => void;
  user?: UserData | null;
}

export default function SidebarIndividualLandlord({
  collapsed,
  toggleCollapse,
  onLogoutClick,
  user,
}: IndividualLandlordSidebarProps) {
  const pathname = usePathname();

  const displayName = user?.username || "Landlord";
  const profilePicture = user?.profilePicture || null;

  const navGroups = [
    {
      title: "Main",
      links: [
        { icon: Home, label: "Dashboard", href: "/dashboard/landlord" },
        { icon: Building2, label: "My Properties", href: "/dashboard/landlord/properties" },
        { icon: Heart, label: "Saved Leads", href: "/dashboard/landlord/saved" },
        { icon: Calendar, label: "Appointments", href: "/dashboard/landlord/appointments" },
      ],
    },
    {
      title: "Account",
      links: [
        { icon: FileText, label: "Transactions", href: "/dashboard/landlord/transactions" },
        { icon: MessageSquare, label: "Messages", href: "/dashboard/landlord/messages" },
        { icon: Star, label: "Reviews", href: "/dashboard/landlord/reviews" },
        { icon: Settings, label: "Settings", href: "/dashboard/landlord/settings" },
      ],
    },
    {
      title: "Support",
      links: [{ icon: HelpCircle, label: "Help Center", href: "/dashboard/landlord/help" }],
    },
  ];

  return (
    <nav
      className={`flex flex-col text-gray-800 dark:text-gray-100 border-r border-gray-200 dark:border-gray-800 transition-all duration-300 ease-in-out
      ${collapsed ? "w-20 items-center" : "w-64"} h-screen bg-white/70 dark:bg-gray-900/70 backdrop-blur-md`}
    >
      {/* User Header */}
      <div
        className={`flex p-3 w-full transition-all duration-300 ${
          collapsed ? "flex-col justify-center gap-2" : "items-center justify-between"
        }`}
      >
        <div className="flex items-center gap-3">
          {profilePicture ? (
            <Image
              src={profilePicture}
              alt="Profile"
              width={40}
              height={40}
              className="rounded-full object-cover aspect-square min-w-10 min-h-10"
            />
          ) : (
            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-br from-purple-400 to-pink-400 text-white font-semibold">
              {displayName
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()}
            </div>
          )}
          {!collapsed && (
            <div className="flex flex-col min-w-0">
              <span className="text-sm text-gray-500 dark:text-gray-400">Hello,</span>
              <span className="text-base font-semibold truncate capitalize">{displayName}</span>
            </div>
          )}
        </div>

        <button
          onClick={toggleCollapse}
          className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition"
        >
          {collapsed ? (
            <ChevronRight size={18} className="text-gray-500" />
          ) : (
            <ChevronLeft size={18} className="text-gray-500" />
          )}
        </button>
      </div>

      {/* Nav Links */}
      <div className="flex-1 flex flex-col overflow-y-hidden hover:overflow-y-auto transition-all duration-200 pt-0">
        <div className="flex-1 flex flex-col gap-6 py-4">
          {navGroups.map((group) => (
            <div key={group.title} className="flex flex-col gap-1 w-full">
              {!collapsed && (
                <h3 className="text-xs uppercase font-semibold tracking-wide text-gray-400 dark:text-gray-500 px-2">
                  {group.title}
                </h3>
              )}
              {group.links.map(({ icon: Icon, label, href }) => {
                const active = pathname === href;
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`flex items-center gap-3 p-3 rounded-md transition-colors w-full
                      ${
                        active
                          ? "bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300"
                          : "hover:bg-gray-100 dark:hover:bg-gray-800"
                      }
                      ${collapsed ? "justify-center" : ""}`}
                  >
                    <Icon
                      size={18}
                      className={`shrink-0 ${
                        active
                          ? "text-purple-600 dark:text-purple-300"
                          : "text-gray-700 dark:text-gray-300"
                      }`}
                    />
                    {!collapsed && <span className="text-sm font-medium">{label}</span>}
                  </Link>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Logout Button */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-800 shrink-0">
        <button
          onClick={onLogoutClick}
          className={`flex items-center gap-3 p-3 cursor-pointer rounded-md bg-purple-100/60 hover:bg-purple-200/80 dark:bg-purple-900/50 dark:hover:bg-purple-800/70 transition-colors w-full ${
            collapsed ? "justify-center " : ""
          }`}
        >
          <LogOut size={18} className="text-red-500" />
          {!collapsed && <span className="text-sm font-medium text-red-500">Log Out</span>}
        </button>
      </div>
    </nav>
  );
}