"use client";

import Link from "next/link";
import { useState } from "react";
import { Bell, Search, Plus, User, Calendar } from "lucide-react";

interface Notification {
  id: string;
  message: string;
  time: string;
  read: boolean;
}

type NavbarProps = {
  toggleSidebar?: () => void;
};

export default function NavbarIndividualLandlord({ toggleSidebar }: NavbarProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [notifOpen, setNotifOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Mark all notifications as read
  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <nav className="sticky top-0 z-40 w-full flex justify-between items-center px-4 sm:px-6 py-3 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
      {/* Sidebar toggle (mobile) */}
      <button
        onClick={toggleSidebar}
        className="block lg:hidden p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition"
        aria-label="Toggle sidebar"
      >
        <svg
          className="w-6 h-6 text-gray-700 dark:text-gray-200"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Search bar */}
      <div className="relative flex items-center gap-2 flex-1 max-w-sm">
        <Search size={18} className="text-gray-500" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search your listings..."
          className="bg-transparent outline-none border-b border-gray-300 focus:border-gray-500 w-full text-sm sm:text-base text-gray-700 dark:text-gray-200 placeholder-gray-400"
        />
      </div>

      {/* Quick actions & notifications */}
      <div className="flex items-center gap-4">
        {/* Add Listing */}
        <Link
          href="/dashboard/landlord/listings/create"
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          title="Add Listing"
        >
          <Plus className="w-5 h-5 text-gray-700 dark:text-gray-200" />
        </Link>

        {/* Appointments */}
        <Link
          href="/dashboard/landlord/appointments"
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          title="Appointments"
        >
          <Calendar className="w-5 h-5 text-gray-700 dark:text-gray-200" />
        </Link>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5 text-gray-700 dark:text-gray-200" />
            {notifications.some((n) => !n.read) && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-900 rounded-lg shadow-xl z-50">
              <div className="flex justify-between items-center p-3 border-b border-gray-200 dark:border-gray-700">
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                  Notifications
                </h4>
                {notifications.length > 0 && (
                  <button onClick={markAllRead} className="text-xs text-blue-500 hover:underline">
                    Mark all as read
                  </button>
                )}
              </div>

              <div className="max-h-60 overflow-y-auto flex flex-col">
                {notifications.length === 0 ? (
                  <p className="p-3 text-sm text-gray-500 text-center">No notifications</p>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`flex flex-col gap-1 p-3 border-b border-gray-100 dark:border-gray-800 ${
                        n.read
                          ? "text-gray-500 dark:text-gray-400"
                          : "text-gray-800 dark:text-gray-200 font-medium"
                      }`}
                    >
                      <span>{n.message}</span>
                      <span className="text-xs text-gray-400">{n.time}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Profile */}
        <Link href="/dashboard/landlord/settings">
          <User className="w-6 h-6 text-gray-700 dark:text-gray-200" />
        </Link>
      </div>
    </nav>
  );
}