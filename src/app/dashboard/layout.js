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
  FaSearch,
  FaSignOutAlt,
} from "react-icons/fa";
import CategoriesDropdown from "../components/CategoriesDropdown";
import { useSession,signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All Categories");
  const dropdownRef = useRef(null);
  const sidebarItems = [
    { key: "posts", label: "Posts", icon: <FaHome size={18} /> },
    { key: "wishlist", label: "Wishlist", icon: <FaHeart size={18} /> },
    { key: "chat", label: "Chat Support", icon: <FaComments size={18} /> },
    { key: "profile", label: "Profile", icon: <FaUser size={18} /> },
  ];

  const { data: session, status } = useSession();
  const user = session?.user; // { name, email, image }
  const router = useRouter();
  console.log(user?.image);
  const pathname = usePathname();
  const activeSection = pathname?.split("/")[2] || "posts";
  const [showAllCategories, setShowAllCategories] = useState(false);
  const categories = [
    "All Categories",
    "Construction & Home Services",
    "Vehicle Services",
    "Weaving & Textile",
    "Food and Culinary",

  ];
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

  // Subcategories / Professions data
  const categoryData = {
    "Construction & Home Services": [
      "Painting",
      "Plumbing",
      "Electrician",
      "POP Designing",
      "Carpentry",
      "Masonry",
      "Tiling",
    ],
    "Vehicle Services": ["Bike Mechanic", "Car Mechanic", "Auto Mechanic"],
    "Weaving & Textile": [
      "Handloom Weavers",
      "Powerloom Weavers",
      "Tailoring/Stitching",
      "Embroidery & Crafts",
    ],
    "Food and Culinary": ["Cooking", "Baking", "Catering", "Street Food"],
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setShowAllCategories(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex h-screen font-sans bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`flex flex-col bg-white text-black border-r border-gray-200 transition-all duration-300 ${
          sidebarOpen ? "w-64" : "w-20"
        }`}
      >
        {/* Top: Logo + Toggle */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div
            className={`text-2xl font-bold tracking-wide ${
              sidebarOpen ? "text-black" : "hidden"
            }`}
          >
            BlueCollorHub
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded hover:bg-gray-100 transition"
          >
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
              <span className={`${sidebarOpen ? "inline" : "hidden"}`}>
                {item.label}
              </span>
            </button>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-gray-200">
          <button
          onClick={() => signOut({ callbackUrl: "/" })}
            className={`flex items-center gap-3 w-full text-left px-4 py-3 rounded-md transition hover:bg-gray-100 ${
              sidebarOpen ? "text-black" : "text-gray-500"
            }`}
          >
            <FaSignOutAlt />
            <span className={`${sidebarOpen ? "inline" : "hidden"}`}>
              Logout
            </span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Top Navbar */}
        <header className="flex justify-between items-center px-6 py-3 bg-white text-black shadow-md">
          {/* Left section: Logo, Location, Search */}
          <div className="flex items-center gap-6">
            {/* Logo Text */}
            <div className="text-2xl font-bold text-black tracking-wide">
              Blue
            </div>

            {/* Location Selector */}
            <select
              className={`border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-black text-black transition-all duration-300 ${
                sidebarOpen ? "w-45" : "w-64"
              }`}
            >
              <option>Location 1</option>
              <option>Location 2</option>
              <option>Location 3</option>
            </select>

            {/* Search Input */}
            <div
              className={`relative transition-all duration-300 ${
                sidebarOpen ? "w-84" : "w-102"
              }`}
            >
              <input
                type="text"
                placeholder="Search for posts, users..."
                className="border border-gray-300 rounded-lg pl-10 pr-3 py-2 w-full focus:outline-none focus:ring-1 focus:ring-black placeholder-gray-500 transition"
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          {/* Right section: Language, Create, Profile */}
          <div className="flex items-center gap-4">
            {/* Language Selector */}
            <select
              className={`${
                sidebarOpen ? "w-22" : "w-32"
              } border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-black text-black`}
            >
              <option>EN</option>
              <option>ES</option>
              <option>FR</option>
            </select>

            {/* Create Button */}
            <button onClick={()=>router.push('/dashboard/createpost')} className="flex items-center gap-2 px-6 py-2 rounded-full bg-black text-white font-semibold border border-black hover:bg-transparent hover:text-black transition cursor-pointer">
              <FaPlus /> Create
            </button>

                    {/* Profile Circle */}
        <div className="relative w-10 h-10 rounded-full overflow-hidden cursor-pointer">
          {user?.image ? (
            <img
              src={user.image}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-800 flex items-center justify-center text-white font-semibold text-lg">
              {user?.name
                ?.split(" ")
                .map((n) => n[0])
                .join("") || "U"}
            </div>
          )}
        </div>

          </div>
        </header>

{/* Sub Navbar */}
<div className="flex gap-3 p-3 bg-gray-100 border-b border-gray-200 px-6 relative">

  {/* All Categories Button + Dropdown */}
  <div className="relative flex-shrink-0" ref={dropdownRef}>
    <button
      onClick={() => {
        setShowAllCategories((prev) => !prev);
        setActiveCategory("All Categories"); // mark All Categories as active
      }}
      className={`px-4 py-2 rounded-lg font-medium transition ${
        activeCategory === "All Categories"
          ? "bg-black text-white hover:bg-black"
          : "bg-white text-black hover:bg-gray-200"
      }`}
    >
      All Categories ▾
    </button>

    {/* Dropdown */}
    {showAllCategories && (
      <div>
        <CategoriesDropdown />
      </div>
    )}
  </div>

  {/* Scrollable Subcategories */}
  <div className="flex-1 overflow-x-auto">
    <div className="flex gap-3">
    {categories
    .filter((cat) => cat !== "All Categories")
    .map((cat) => {
        const catKey = cat.toLowerCase().replace(/ & /g, "-").replace(/ /g, "-");
        return (
        <button
            key={cat}
            onClick={() => {
            setShowAllCategories(false); // close dropdown
            setActiveCategory(cat); // mark as active
            router.push(`/dashboard/${catKey}`);
            }}
            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition ${
            activeCategory === cat
                ? "bg-black text-white hover:bg-black"
                : "bg-white text-black hover:bg-gray-200"
            }`}
        >
            {cat}
        </button>
        );
    })}

    </div>
  </div>

</div>






        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
