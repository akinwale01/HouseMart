"use client";

import { useState, useEffect } from "react";
import { Bell, Search, ShoppingCart, X, Trash2 } from "lucide-react";

interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
}

interface Notification {
  id: string;
  message: string;
  time: string;
  read: boolean;
}

type CustomerNavbarProps = {
  toggleSidebar?: () => void;
};

export default function CustomerNavbar({ toggleSidebar }: CustomerNavbarProps) {
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [notifications, setNotifications] = useState<Notification[]>([]); // 🧠 starts empty
  const [notifOpen, setNotifOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<{ id: string; name: string }[]>([]);

  // 🧠 Load cart from localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    const storedCart = localStorage.getItem("cart");
    if (storedCart) setCartItems(JSON.parse(storedCart));
  }, []);

  // 🧠 Search logic (mock filtering)
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    const mockProperties = [
      { id: "1", name: "Oceanview Apartment" },
      { id: "2", name: "Luxury Villa" },
      { id: "3", name: "City Center Studio" },
      { id: "4", name: "Country Cottage" },
    ];

    const results = mockProperties.filter((p) =>
      p.name.toLowerCase().includes(query.toLowerCase())
    );
    setSearchResults(results);
  };

  const removeFromCart = (id: string) => {
    const updated = cartItems.filter((item) => item.id !== id);
    setCartItems(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  // 🧠 Delete a notification
  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <>
      {/* 🧭 Navbar */}
      <nav className="sticky top-0 z-40 w-full flex justify-between items-center px-4 sm:px-6 py-3 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        {/* ☰ Sidebar Toggle (Mobile) */}
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

        {/* 🔍 Search */}
        <div className="relative flex items-center gap-2 flex-1 max-w-sm">
          <Search size={18} className="text-gray-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search properties..."
            className="bg-transparent outline-none border-b border-gray-300 focus:border-gray-500 w-full text-sm sm:text-base text-gray-700 dark:text-gray-200 placeholder-gray-400"
          />
          {/* 🔎 Search Dropdown */}
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

        {/* 🔔 + 🛒 Icons */}
        <div className="flex items-center gap-4">
          {/* 🔔 Notifications */}
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

            {/* Dropdown */}
            {notifOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-900 rounded-lg shadow-xl z-50">
                <div className="flex justify-between items-center p-3 border-b border-gray-200 dark:border-gray-700">
                  <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                    Notifications
                  </h4>
                  {notifications.length > 0 && (
                    <button
                      onClick={() =>
                        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
                      }
                      className="text-xs text-blue-500 hover:underline"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>

                {/* Body */}
                <div className="max-h-60 overflow-y-auto flex flex-col">
                  {notifications.length === 0 ? (
                    <p className="p-3 text-sm text-gray-500 text-center">
                      No notifications yet
                    </p>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`flex justify-between items-start p-3 border-b border-gray-100 dark:border-gray-800 ${
                          n.read
                            ? "text-gray-500 dark:text-gray-400"
                            : "text-gray-800 dark:text-gray-200 font-medium"
                        }`}
                      >
                        <div className="flex flex-col gap-1">
                          <span>{n.message}</span>
                          <span className="text-xs text-gray-400">{n.time}</span>
                        </div>
                        <button
                          onClick={() => deleteNotification(n.id)}
                          className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                          aria-label="Delete notification"
                        >
                          <Trash2 size={14} className="text-red-500" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* 🛒 Cart */}
          <button
            type="button"
            onClick={() => setCartOpen(true)}
            className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            aria-label="Cart"
          >
            <ShoppingCart className="w-5 h-5 text-gray-700 dark:text-gray-200" />
            {cartItems.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-semibold w-4 h-4 flex items-center justify-center rounded-full">
                {cartItems.length}
              </span>
            )}
          </button>
        </div>
      </nav>

      {/* 🧾 Centered Cart Modal */}
      {cartOpen && (
        <div className="fixed inset-0 top-100 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-11/12 sm:w-[400px] max-h-[80vh] flex flex-col justify-between">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-black dark:text-white">Your Cart</h2>
              <button
                onClick={() => setCartOpen(false)}
                className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              >
                <X size={20} className="text-gray-700 dark:text-gray-200" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
              {cartItems.length === 0 ? (
                <p className="text-black dark:text-white text-center text-sm py-6">
                  🛒 Your cart is empty
                </p>
              ) : (
                cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-2"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 rounded-md object-cover"
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-800 dark:text-gray-100">
                          {item.name}
                        </p>
                        <p className="text-xs text-black dark:text-gray-400">
                          ${item.price.toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-xs text-red-500 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Footer / Checkout */}
            {cartItems.length > 0 && (
              <div className="border-t border-gray-200 dark:border-gray-800 p-4">
                <button className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition">
                  Checkout
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}