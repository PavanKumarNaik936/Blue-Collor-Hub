"use client";

import { useState, useEffect, useRef } from "react";
import {
  FaBars,
  FaTimes,
  FaHome,
  FaHeart,
  FaComments,
  FaUser,
  FaPlus,
  FaSignOutAlt,
} from "react-icons/fa";
import CategoriesDropdown from "../components/CategoriesDropdown";
import ChatSupport from "../components/ChatSupport";
import { useSession, signOut } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import SearchBar from "../components/SearchBar";
import categoriesWithSkills from "@/data/categoriesWithSkills";
import React from "react";

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All Categories");
  const [mounted, setMounted] = useState(false); // client-only
  const [showAllCategories, setShowAllCategories] = useState(false);
  const dropdownRef = useRef(null);

  const { data: session } = useSession();
  const user = session?.user;
  const router = useRouter();
  const pathname = usePathname();
  const activeSection = pathname?.split("/")[2] || "posts";

  const categories = ["All Categories", ...Object.keys(categoriesWithSkills)];

  const sidebarItems = [
    { key: "posts", label: "Posts", icon: <FaHome size={18} /> },
    { key: "wishlist", label: "Wishlist", icon: <FaHeart size={18} /> },
    { key: "chat", label: "Chat Support", icon: <FaComments size={18} /> },
    { key: "profile", label: "Profile", icon: <FaUser size={18} /> },
  ];

  // Client-only mount to avoid hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowAllCategories(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Pass sidebarOpen to children dynamically
  const childrenWithSidebar = React.Children.map(children, (child) =>
    React.isValidElement(child)
      ? React.cloneElement(child, { sidebarOpen })
      : child
  );

  // Unified handler for category/skill click
  const handleCategorySearch = (category, skill = null) => {
    setActiveCategory(category);
    setShowAllCategories(false);

    const params = new URLSearchParams();
    params.append("category", category);
    if (skill) params.append("skill", skill);

    router.push(`/dashboard/posts?${params.toString()}`);
  };

  return (
    <div className="flex h-screen font-sans bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`flex flex-col bg-white text-black border-r border-gray-200 transition-all duration-300 ${
          sidebarOpen ? "w-64" : "w-20"
        }`}
      >
        {/* Logo + Toggle */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className={`${sidebarOpen ? "text-black text-2xl font-bold tracking-wide" : "hidden"}`}>
            BlueCollorHub
          </div>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 rounded hover:bg-gray-100 transition">
            {sidebarOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 flex flex-col mt-4 gap-2 px-2">
          {sidebarItems.map((item) => (
            <button
              key={item.key}
              onClick={() => router.push(`/dashboard/${item.key}`)}
              className={`flex items-center gap-3 w-full text-left px-4 py-3 rounded-md transition ${
                activeSection === item.key
                  ? "bg-black text-white font-semibold"
                  : "text-gray-700 hover:bg-gray-100 hover:text-black"
              }`}
            >
              {item.icon}
              <span className={`${sidebarOpen ? "inline" : "hidden"}`}>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className={`flex items-center gap-3 w-full text-left px-4 py-3 rounded-md transition hover:bg-gray-100 ${
              sidebarOpen ? "text-black" : "text-gray-500"
            }`}
          >
            <FaSignOutAlt />
            <span className={`${sidebarOpen ? "inline" : "hidden"}`}>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Navbar */}
        <header className="flex justify-between items-center px-6 py-3 bg-white text-black shadow-md">
          <div className="flex items-center gap-6">
            <div className="text-2xl font-bold text-black tracking-wide">Blue</div>
            <SearchBar />
          </div>

          <div className="flex items-center gap-4">
            <select className={`${sidebarOpen ? "w-22" : "w-32"} border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-black text-black`}>
              <option>EN</option>
              <option>ES</option>
              <option>FR</option>
            </select>

            <button
              onClick={() => router.push("/dashboard/createpost")}
              className="group flex items-center gap-2 px-6 py-2 rounded-full border border-black bg-black text-white"
            >
              <FaPlus className="transition-colors duration-300 text-white group-hover:text-black" />
              <span className="transition-colors duration-300 text-white group-hover:text-black">Create</span>
            </button>

            <div className="relative w-10 h-10 rounded-full overflow-hidden cursor-pointer">
              {user?.image ? (
                <img src={user.image} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gray-800 flex items-center justify-center text-white font-semibold text-lg">
                  {user?.name?.split(" ").map((n) => n[0]).join("") || "U"}
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Sub Navbar */}
        <div className="flex gap-3 p-3 bg-gray-100 border-b border-gray-200 px-6 relative">
          <div className="relative flex-shrink-0" ref={dropdownRef}>
            <button
              onClick={() => {
                setShowAllCategories((prev) => !prev);
                setActiveCategory("All Categories");
              }}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                activeCategory === "All Categories"
                  ? "bg-black text-white hover:bg-black"
                  : "bg-white text-black hover:bg-gray-200"
              }`}
            >
              All Categories ▾
            </button>
            {showAllCategories && (
              <CategoriesDropdown onSkillClick={handleCategorySearch} />
            )}
          </div>

          {/* Scrollable Categories */}
          <div className="w-200 overflow-x-auto" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
            <div className="flex gap-3 min-w-max" style={{ overflow: "hidden" }}>
              {categories
                .filter((cat) => cat !== "All Categories")
                .map((cat) => (
                  <button
                    key={cat}
                    onClick={() => handleCategorySearch(cat)}
                    className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition ${
                      activeCategory === cat
                        ? "bg-black text-white hover:bg-black"
                        : "bg-white text-black hover:bg-gray-200"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
            </div>

            <style jsx>{`
              div::-webkit-scrollbar {
                display: none;
              }
            `}</style>
          </div>
        </div>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-6 relative">
          {childrenWithSidebar}
        </main>
      </div>

      {/* Chat Support Overlay */}
      {mounted && activeSection === "chat" && (
        <ChatSupport sidebarOpen={sidebarOpen} />
      )}
    </div>
  );
}
