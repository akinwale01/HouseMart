"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, ChevronDown } from "lucide-react";
import { usePathname } from "next/navigation";

type DropdownKey = "Resources" | "More";

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<DropdownKey | null>(null);

  const links = ["About", "Rent", "Buy", "Sell", "Resources", "More"];

  const dropdowns: Record<DropdownKey, { name: string; href: string }[]> = {
    Resources: [
      { name: "Blogs", href: "/blogs" },
      { name: "FAQ", href: "/faq" },
      { name: "Help Center", href: "/help-center" },
    ],
    More: [
      { name: "Terms & Conditions", href: "/terms" },
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Support", href: "/support" },
    ],
  };

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);
  const resetActiveLink = () => closeMenu();
  const isActive = (link: string) => pathname === `/${link.toLowerCase()}`;

  return (
    <nav className="fixed top-21 z-50 w-full">
      <div className="mx-auto lg:max-w-[1440px] px-4 md:px-14">
        <div className="bg-white border border-gray-300 rounded-xl p-6 flex flex-col lg:flex-row items-center gap-4 relative">
          {/* Logo */}
          <div className="w-full flex items-center justify-between lg:justify-start lg:w-auto">
            <Link
              href="/"
              className={`text-2xl font-bold transition ${
                pathname === "/"
                  ? "text-orange-500"
                  : "text-orange-500 hover:text-orange-600"
              }`}
              onClick={resetActiveLink}
            >
              🏠 HouseMart
            </Link>

            {/* Hamburger */}
            <button
              className="lg:hidden text-gray-700 focus:outline-none"
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex flex-1 items-center justify-between">
            <ul className="flex gap-8 mx-auto font-medium text-gray-700 relative">
              {links.map((link) => {
                const isDropdown = link === "Resources" || link === "More";
                return (
                  <li
                    key={link}
                    className="relative"
                    onMouseEnter={() =>
                      isDropdown ? setOpenDropdown(link as DropdownKey) : null
                    }
                    onMouseLeave={() => setOpenDropdown(null)}
                  >
                    <div className="flex items-center gap-1 cursor-pointer">
                      <Link
                        href={`/${link.toLowerCase()}`}
                        onClick={closeMenu}
                        className={`text-lg transition-all duration-300 ${
                          isActive(link)
                            ? "text-orange-500 text-2xl"
                            : "hover:text-orange-500"
                        }`}
                      >
                        {link}
                      </Link>
                      {isDropdown && (
                        <ChevronDown
                          size={18}
                          className={`transition-transform duration-300 ${
                            openDropdown === link ? "rotate-180 text-orange-500" : ""
                          }`}
                        />
                      )}
                    </div>

                    {/* Dropdown Menu */}
                    {isDropdown && openDropdown === link && (
                      <div className="absolute left-0 top-full mt-2 bg-white border border-gray-300 rounded-lg shadow-md z-40">
                        <ul className="flex flex-col min-w-[180px] py-2">
                          {dropdowns[link as DropdownKey].map((item) => (
                            <li key={item.name}>
                              <Link
                                href={item.href}
                                className="block px-4 py-2 text-gray-700 hover:text-orange-500 hover:bg-orange-50"
                              >
                                {item.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>

            {/* Auth Buttons */}
            <div className="flex items-center gap-4">
              <Link
                href="/login"
                className="border border-orange-500 text-orange-500 rounded-lg px-6 py-2 hover:bg-orange-50 transition"
                onClick={resetActiveLink}
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="bg-orange-500 text-white rounded-lg px-6 py-2 hover:bg-orange-600 transition"
                onClick={resetActiveLink}
              >
                Sign Up
              </Link>
            </div>
          </div>

          {/* Mobile Menu */}
          <div
            className={`lg:hidden w-full overflow-hidden transition-all duration-300 ${
              menuOpen ? "max-h-[500px]" : "max-h-0"
            }`}
          >
            <ul className="flex flex-col items-center gap-3 text-gray-700 font-medium w-full mt-4">
              {links.map((link) => (
                <li key={link}>
                  <Link
                    href={`/${link.toLowerCase()}`}
                    onClick={closeMenu}
                    className={`w-full text-center text-lg transition-all duration-300 ${
                      isActive(link)
                        ? "text-orange-500 text-xl"
                        : "hover:text-orange-500 hover:text-xl"
                    }`}
                  >
                    {link}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="flex flex-col items-center gap-3 pb-6 w-full mt-4">
              <Link
                href="/login"
                className="border border-orange-500 text-orange-500 rounded-lg px-6 py-2 w-[200px] text-center hover:bg-orange-50 transition"
                onClick={resetActiveLink}
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="bg-orange-500 text-white rounded-lg px-6 py-2 w-[200px] text-center hover:bg-orange-600 transition"
                onClick={resetActiveLink}
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}