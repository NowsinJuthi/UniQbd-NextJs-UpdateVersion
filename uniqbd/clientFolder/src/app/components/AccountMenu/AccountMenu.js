"use client";

import React, { useContext, useState, useRef, useEffect } from "react";
import Link from "next/link";
import Cookies from "js-cookie";
import { FiUser } from "react-icons/fi";
import { MyContext } from "@/context/ThemeContext";
import { useRouter } from "next/navigation";
import api from "@/utils/api";

const AccountMenu = () => {
  const router = useRouter();

  const { isLogin, user, setIsLogin, setUser } = useContext(MyContext);

  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  // close when click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await api.get("/logout", {
        withCredentials: true,
      });

      // clear cookies
      Cookies.remove("userName");
      Cookies.remove("userEmail");
      Cookies.remove("actionType");

      // clear react state
      setUser({ name: "", email: "", role: "" });
      setIsLogin(false);

      setOpen(false);

      // force refresh so navbar resets
      router.push("/dashboard/login");
      router.refresh(); // IMPORTANT in Next.js
    } catch (error) {
      console.log("Logout error:", error);
    }
  };

  const dashboardRoute = user?.role === "ADMIN" ? "/admin" : "/my-account";

  return (
    <div className="relative" ref={menuRef}>
      {isLogin ? (
        <button
          onClick={() => setOpen(!open)}
          className="font-medium hover:text-button transition"
        >
          {user?.name || "Account"}
        </button>
      ) : (
        <Link href="/dashboard/login">
          <FiUser className="text-xl cursor-pointer hover:text-text transition" />
        </Link>
      )}

      {open && (
        <div
          className="absolute right-0 mt-2 w-44 rounded-xl shadow-lg 
          bg-background border border-white/10 backdrop-blur-xl p-2 space-y-1"
        >
          {/* Dashboard route based on role */}
          <Link href={dashboardRoute}>
            <button
              onClick={() => setOpen(false)}
              className="w-full text-left px-3 py-2 rounded-lg hover:bg-imgcard transition"
            >
              Dashboard
            </button>
          </Link>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-full text-left px-3 py-2 rounded-lg text-red-400 hover:bg-red-500/10 transition"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default AccountMenu;
