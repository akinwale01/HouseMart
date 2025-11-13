"use client";

import Link from "next/link";
import { useState } from "react";
import { Bell, Search, Plus, MessageSquare, Calendar } from "lucide-react";

interface Notification {
  id: string;
  message: string;
  time: string;
  read: boolean;
}

type AgentNavbarProps = {
  toggleSidebar?: () => void;
};

export default function AgentNavbar({ toggleSidebar }: AgentNavbarProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [notIfOpen, setNotIfOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<{ id: string; name: string }[]>([]);

  // Search logic (mock leads/clients)
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    const mockLeads = [
      { id: "1", name: "John Doe" },
      { id: "2", name: "Acme Corp" },
      { id: "3", name: "Jane Smith" },
      { id: "4", name: "Luxury Villa Lead" },
    ];

    setSearchResults(
      mockLeads.filter((l) => l.name.toLowerCase().includes(query.toLowerCase()))
    );
  };

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
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search leads or clients..."
          className="bg-transparent outline-none border-b border-gray-300 focus:border-gray-500 w-full text-sm sm:text-base text-gray-700 dark:text-gray-200 placeholder-gray-400"
        />
        {searchResults.length > 0 && (
          <div className="absolute top-full left-0 w-full bg-white dark:bg-gray-900 shadow-lg rounded-md p-2 mt-1 max-h-60 overflow-y-auto z-50">
            {searchResults.map((r) => (
              <div
                key={r.id}
                className="p-2 text-sm text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md cursor-pointer"
              >
                {r.name}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick actions & notifications */}
      <div className="flex items-center gap-4">
        {/* Quick Actions / Shortcuts */}
        <Link
          href="/dashboard/agent/listings/create"
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          title="Add Listing"
        >
          <Plus className="w-5 h-5 text-gray-700 dark:text-gray-200" />
        </Link>

        <Link
          href="/dashboard/agent/messages"
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          title="Messages"
        >
          <MessageSquare className="w-5 h-5 text-gray-700 dark:text-gray-200" />
        </Link>

        <Link
          href="/dashboard/agent/appointments"
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          title="Appointments"
        >
          <Calendar className="w-5 h-5 text-gray-700 dark:text-gray-200" />
        </Link>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setNotIfOpen(!notIfOpen)}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5 text-gray-700 dark:text-gray-200" />
            {notifications.some((n) => !n.read) && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            )}
          </button>

          {notIfOpen && (
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
      </div>
    </nav>
  );
}