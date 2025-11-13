"use client";
import { useState, useRef } from "react";
import Link from "next/link";
import { Menu, X, ChevronDown } from "lucide-react";
import { usePathname } from "next/navigation";

type DropdownKey = "Resources" | "More";

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<DropdownKey | null>(null);
  const dropdownTimer = useRef<NodeJS.Timeout | null>(null);

  const links = ["About", "Rent", "Buy", "Sell", "Resources", "More"];

  const dropdowns: Record<DropdownKey, { name: string; href: string }[]> = {
    Resources: [
      { name: "Blogs", href: "/blogs" },
      { name: "FAQ", href: "/faq" },
      { name: "Support", href: "/support" },
    ],
    More: [
      { name: "Legal", href: "/legal" },
      { name: "Help Center", href: "/help-center" },
    ],
  };

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);
  const resetActiveLink = () => closeMenu();
  const isActive = (link: string) => pathname === `/${link.toLowerCase()}`;

  const isDropdownActive = (key: DropdownKey) =>
    dropdowns[key].some((item) => pathname.startsWith(item.href));

  const handleDropdownEnter = (key: DropdownKey) => {
    if (dropdownTimer.current) clearTimeout(dropdownTimer.current);
    setOpenDropdown(key);
  };

  const handleDropdownLeave = () => {
    if (dropdownTimer.current) clearTimeout(dropdownTimer.current);
    dropdownTimer.current = setTimeout(() => setOpenDropdown(null), 80);
  };

  return (
    <nav className="fixed top-20 z-50 w-full">
      <div className="mx-auto lg:max-w-[1440px] px-4 md:px-14">
        <div className="bg-white border border-gray-300 rounded-xl p-6 flex flex-col lg:flex-row items-center gap-4 relative">
          {/* Logo */}
          <div className="w-full flex items-center justify-between lg:justify-start lg:w-auto">
            <Link
              href="/"
              className={`text-2xl font-bold transition ${
                pathname === "/" ? "text-orange-500" : "text-orange-500 hover:text-orange-600"
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
                const parentActive = isDropdown ? isDropdownActive(link as DropdownKey) : isActive(link);

                return (
                  <li key={link} className="relative">
                    <div
                      className="flex items-center gap-1 cursor-pointer relative"
                      onMouseEnter={() => (isDropdown ? handleDropdownEnter(link as DropdownKey) : null)}
                      onMouseLeave={() => isDropdown && handleDropdownLeave()}
                    >
                      {isDropdown ? (
                        <span
                          className={`text-lg transition-all duration-300 ${
                            parentActive ? "text-orange-500 text-2xl" : "hover:text-orange-500"
                          }`}
                        >
                          {link}
                        </span>
                      ) : (
                        <Link
                          href={`/${link.toLowerCase()}`}
                          onClick={closeMenu}
                          className={`text-lg transition-all duration-300 ${
                            parentActive ? "text-orange-500 text-2xl" : "hover:text-orange-500"
                          }`}
                        >
                          {link}
                        </Link>
                      )}

                      {isDropdown && (
                        <ChevronDown
                          size={18}
                          className={`transition-transform duration-300 ${
                            openDropdown === link ? "rotate-180 text-orange-500" : parentActive ? "text-orange-500" : ""
                          }`}
                        />
                      )}

                      {/* Dropdown Box */}
                      {isDropdown && openDropdown === link && (
                        <div
                          className="absolute left-1/2 -translate-x-1/2 top-full mt-5 bg-white border border-gray-300 rounded-lg shadow-md z-40"
                          onMouseEnter={() => handleDropdownEnter(link as DropdownKey)}
                          onMouseLeave={handleDropdownLeave}
                        >
                          <ul className="flex flex-col min-w-[180px] py-2 text-left">
                            {dropdowns[link as DropdownKey].map((item) => (
                              <li key={item.name}>
                                <Link
                                  href={item.href}
                                  className={`block px-4 py-2 transition-all duration-300 ${
                                    pathname === item.href
                                      ? "text-orange-500 font-semibold"
                                      : "text-gray-700 hover:text-orange-500 hover:bg-orange-50"
                                  }`}
                                  onClick={closeMenu}
                                >
                                  {item.name}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>

            {/* Auth Buttons */}
            <div className="flex items-center gap-4">
              <Link
                href="/login"
                className="border border-orange-500 text-orange-500 rounded-lg px-4 py-2 hover:bg-orange-50 transition"
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
              menuOpen ? "max-h-screen" : "max-h-0"
            }`}
          >
            <ul className="flex flex-col items-center gap-3 text-gray-700 font-medium w-full mt-4">
              {links
                .filter((link) => link !== "Resources" && link !== "More")
                .map((link) => (
                  <li key={link}>
                    <Link
                      href={`/${link.toLowerCase()}`}
                      onClick={closeMenu}
                      className={`w-full text-center text-lg transition-all duration-300 ${
                        isActive(link) ? "text-orange-500 text-xl" : "hover:text-orange-500 hover:text-xl"
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
                className="border border-orange-500 text-orange-500 rounded-lg px-4 py-2 w-[200px] text-center hover:bg-orange-50 transition"
                onClick={resetActiveLink}
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="bg-orange-500 text-white rounded-lg px-4 py-2 w-[200px] text-center hover:bg-orange-600 transition"
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