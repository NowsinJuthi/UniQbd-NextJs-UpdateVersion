"use client";

import Link from "next/link";
import { usePathname } from "next/navigation"; 
import React from "react";
import { FaUser, FaBoxOpen, FaMapMarkerAlt, FaSignOutAlt } from "react-icons/fa";

const MenuPage = () => {
  const pathname = usePathname(); 

  const menuItems = [
    { name: "Dashboard", href: "/my-account", icon: <FaUser /> },
    { name: "Orders", href: "/my-account/orders", icon: <FaBoxOpen /> },
    { name: "Address", href: "/my-account/address", icon: <FaMapMarkerAlt /> },
    { name: "Account Details", href: "/my-account/edit-account", icon: <FaUser /> },
  ];

  return (
    <div className="md:col-span-3 bg-gradient-to-b from-imgcard to-background border-r border-white/10 p-6">

      {/* profile */}
      <div className="flex flex-col items-center text-center mb-8">
        <div className="w-16 h-16 rounded-full bg-button flex items-center justify-center text-white text-xl shadow-lg">
          <FaUser />
        </div>
        <p className="mt-3 font-semibold text-text">My Account</p>
        <span className="text-xs opacity-60">UniQbd User</span>
      </div>

      {/* menu */}
      <div className="space-y-2 text-sm">
        {menuItems.map((item) => {
          const isActive = pathname === item.href; 
          return (
            <Link key={item.href} href={item.href}>
              <div
                className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition
                  ${isActive ? "bg-button text-white shadow-md shadow-button/30" : "hover:bg-white/5 text-text/80"}`}
              >
                {item.icon}
                {item.name}
              </div>
            </Link>
          );
        })}

        {/* logout */}
        <button className="flex items-center gap-3 w-full mt-6 p-3 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition">
          <FaSignOutAlt />
          Logout
        </button>
      </div>
    </div>
  );
};

export default MenuPage;