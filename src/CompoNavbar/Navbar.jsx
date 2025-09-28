import React, { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // 
  const [theme, setTheme] = useState("light");
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  //
  useEffect(() => {
    try {
      const saved = localStorage.getItem("theme");
      if (saved === "dark" || saved === "light") {
        setTheme(saved);
      } else if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
        setTheme("dark");
      } else {
        setTheme("light");
      }
    } catch (e) {
      setTheme("light");
    }
  }, []);

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    try {
      localStorage.setItem("theme", theme);
    } catch (e) { /* ignore */ }
  }, [theme]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDropdown = () => setDropdownOpen((p) => !p);

  const toggleTheme = () => setTheme((p) => (p === "light" ? "dark" : "light"));

  const handleLogout = () => {
    logout();
  
    window.location.href = "/login";
  };

  return (
    <header className="w-full bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-3 py-1 md:py-2">
        {/* Left: Logo */}
        <div>
          <NavLink to="/" className="flex items-center">
            <img
              src="TradedaerV01.png"
              alt="Trading Unlock Logo"
              className="h-10 w-auto"
            />
          </NavLink>
        </div>

        {/* Right: Links + Profile */}
        <nav>
          <ul className="flex items-center space-x-6 text-sm font-medium">
            <li>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  isActive
                    ? "text-green-600 dark:text-green-400 border-b-2 border-green-600 dark:border-green-400 pb-1"
                    : "hover:text-green-500 dark:hover:text-green-300"
                }
              >
                Home
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/watchlist"
                className={({ isActive }) =>
                  isActive
                    ? "text-green-600 dark:text-green-400 border-b-2 border-green-600 dark:border-green-400 pb-1"
                    : "hover:text-green-500 dark:hover:text-green-300"
                }
              >
                Watchlist
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/portfolio"
                className={({ isActive }) =>
                  isActive
                    ? "text-green-600 dark:text-green-400 border-b-2 border-green-600 dark:border-green-400 pb-1"
                    : "hover:text-green-500 dark:hover:text-green-300"
                }
              >
                Portfolio
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/history"
                className={({ isActive }) =>
                  isActive
                    ? "text-green-600 dark:text-green-400 border-b-2 border-green-600 dark:border-green-400 pb-1"
                    : "hover:text-green-500 dark:hover:text-green-300"
                }
              >
                History
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/orders"
                className={({ isActive }) =>
                  isActive
                    ? "text-green-600 dark:text-green-400 border-b-2 border-green-600 dark:border-green-400 pb-1"
                    : "hover:text-green-500 dark:hover:text-green-300"
                }
              >
                Orders
              </NavLink>
            </li>

            {/* Profile Dropdown */}
            <li className="relative" ref={dropdownRef}>
              <button
                className="focus:outline-none flex items-center"
                onClick={toggleDropdown}
                aria-haspopup="true"
                aria-expanded={dropdownOpen}
              >
                <img
                  src="profile.jpg.jpg"
                  alt="User"
                  className="h-9 w-9 rounded-full border-2 border-gray-300 dark:border-gray-700 hover:border-green-400 transition"
                />
              </button>

              {dropdownOpen && (
                <ul className="absolute right-0 mt-2 w-44 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-lg shadow-lg overflow-hidden">
                  <li>
                    <NavLink
                      to="/profile"
                      className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Profile
                    </NavLink>
                  </li>

                  <li>
                    <NavLink
                      to="/settings"
                      className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Settings
                    </NavLink>
                  </li>

                  <li>
                    <button
                      onClick={toggleTheme}
                      className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      {theme === "light" ? "Dark Mode" : "Light Mode"}
                    </button>
                  </li>

                  <li>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              )}
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
