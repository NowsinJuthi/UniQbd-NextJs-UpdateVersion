"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import {
  FaUser,
  FaBoxOpen,
  FaMapMarkerAlt,
  FaSignOutAlt,
} from "react-icons/fa";
import MenuPage from "./menu/page";
import api from "@/utils/api";

const GlassPanel = ({ children, className = "", glow = false }) => (
  <div
    className={`relative rounded-[1.75rem] p-px bg-gradient-to-br from-button/50 via-cyan-500/20 to-button/30 ${className}`}
  >
    <div
      className={`relative rounded-[1.74rem] bg-imgcard/95 backdrop-blur-2xl backdrop-saturate-200 border border-button/25
        shadow-[0_12px_40px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.15),inset_0_-1px_0_rgba(0,0,0,0.2)]
        ${glow ? "shadow-[0_12px_48px_rgba(14,116,144,0.35),inset_0_1px_0_rgba(255,255,255,0.2)]" : ""}`}
    >
      {children}
    </div>
  </div>
);

const DashCard = ({ href, onClick, icon: Icon, title, description, accent = "button" }) => {
  const isLogout = accent === "red";

  const inner = (
    <div
      className={`group relative h-full rounded-2xl p-px transition-all duration-300 hover:scale-[1.02] active:scale-[0.99] cursor-pointer
        ${isLogout
          ? "bg-gradient-to-br from-red-500/40 via-red-500/15 to-red-500/5 hover:shadow-[0_0_28px_rgba(239,68,68,0.2)]"
          : "bg-gradient-to-br from-button/40 via-cyan-500/10 to-button/20 hover:shadow-[0_0_28px_rgba(14,116,144,0.25)]"
        }`}
    >
      <div
        className={`relative h-full rounded-[0.95rem] p-5 sm:p-6 overflow-hidden
          ${isLogout ? "bg-red-500/10 border border-red-500/25" : "bg-button/15 border border-button/25"}
          group-hover:border-button/45 transition`}
      >
        {!isLogout && (
          <div className="absolute inset-0 bg-gradient-to-br from-button/10 to-transparent opacity-0 group-hover:opacity-100 transition pointer-events-none" />
        )}
        <div className="relative">
          <div
            className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110
              ${isLogout
                ? "bg-red-500/25 border border-red-400/30 text-red-300"
                : "bg-button/35 border border-button/40 text-white shadow-[0_0_16px_rgba(14,116,144,0.3)]"
              }`}
          >
            <Icon className="text-lg" />
          </div>
          <h3 className={`text-base sm:text-lg font-semibold ${isLogout ? "text-red-300" : "text-text"}`}>
            {title}
          </h3>
          <p className={`text-xs sm:text-sm mt-1.5 leading-relaxed ${isLogout ? "text-red-300/60" : "text-text/55"}`}>
            {description}
          </p>
          {!isLogout && (
            <div className="mt-4 flex items-center gap-1 text-[11px] font-medium text-button uppercase tracking-wider opacity-0 group-hover:opacity-100 transition">
              Open
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  if (href) {
    return <Link href={href} className="block h-full">{inner}</Link>;
  }

  return <div onClick={onClick} className="h-full">{inner}</div>;
};

const Account = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/user", { withCredentials: true });
        setUser(res.data.data);
      } catch (error) {
        console.log("Profile fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = async () => {
    try {
      await api.get("/logout", { withCredentials: true });
      window.location.href = "/login";
    } catch (error) {
      console.log("Logout error:", error);
    }
  };

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "U";

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Ambient background */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute top-[-10%] left-[-5%] w-[45vw] h-[45vw] rounded-full bg-button/45 blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-15%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-indigo-600/30 blur-[140px]" />
        <div className="absolute top-[40%] right-[15%] w-[25vw] h-[25vw] rounded-full bg-cyan-500/15 blur-[100px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(14,116,144,0.15),transparent_55%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-button/10 via-transparent to-button/15" />
      </div>

      <div className="relative py-8 sm:py-10 md:py-12 px-4 sm:px-8 md:px-12 lg:px-20 xl:px-28">
        <div className="max-w-7xl mx-auto">
          <GlassPanel glow>
            <div className="grid md:grid-cols-12">
              <MenuPage />

              <div className="md:col-span-9 p-5 sm:p-8 md:p-10 lg:p-12">
                {loading ? (
                  <div className="flex items-center justify-center py-20">
                    <div className="flex items-center gap-3">
                      <span className="w-5 h-5 border-2 border-button/30 border-t-button rounded-full animate-spin" />
                      <span className="text-sm text-text/60">Loading dashboard...</span>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Welcome hero */}
                    <div className="relative rounded-2xl p-px bg-gradient-to-br from-button/40 via-cyan-500/15 to-button/25 mb-6 sm:mb-8">
                      <div className="relative rounded-[0.95rem] overflow-hidden p-6 sm:p-8 bg-imgcard/90 border border-button/20">
                        <div className="absolute inset-0 bg-gradient-to-br from-button/15 via-transparent to-indigo-600/10 pointer-events-none" />
                        <div className="relative flex flex-col sm:flex-row sm:items-center gap-5">
                          <div className="w-16 h-16 sm:w-[4.5rem] sm:h-[4.5rem] rounded-2xl bg-gradient-to-br from-button/60 to-indigo-600/40 border border-button/40 flex items-center justify-center text-xl sm:text-2xl font-bold text-white shadow-[0_0_32px_rgba(14,116,144,0.4)] shrink-0">
                            {initials}
                          </div>
                          <div className="flex-1">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-button/25 border border-button/40 mb-3">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)]" />
                              <span className="text-[10px] sm:text-xs font-medium text-text/70 uppercase tracking-widest">
                                My Account
                              </span>
                            </div>
                            <h1 className="text-2xl sm:text-3xl font-semibold text-text tracking-tight">
                              Welcome back{user?.name ? `, ${user.name}` : ""}
                            </h1>
                            <p className="text-sm text-text/60 mt-2 max-w-lg">
                              Manage your orders, update your address, and edit your account details from your dashboard.
                            </p>
                            {user?.email && (
                              <p className="text-xs text-text/45 mt-2 font-mono">{user.email}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Quick links */}
                    <div className="mb-4 sm:mb-5">
                      <h2 className="text-sm font-semibold text-text uppercase tracking-wider">
                        Quick actions
                      </h2>
                      <p className="text-xs text-text/50 mt-0.5">
                        Everything you need in one place
                      </p>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5">
                      <DashCard
                        href="/my-account/orders"
                        icon={FaBoxOpen}
                        title="Orders"
                        description="View and track all your past and current orders"
                      />
                      <DashCard
                        href="/my-account/address"
                        icon={FaMapMarkerAlt}
                        title="Address"
                        description="Manage your shipping and billing address"
                      />
                      <DashCard
                        href="/my-account/edit-account"
                        icon={FaUser}
                        title="Account details"
                        description="Update your profile name, email and password"
                      />
                      <DashCard
                        onClick={handleLogout}
                        icon={FaSignOutAlt}
                        title="Logout"
                        description="Securely sign out of your account"
                        accent="red"
                      />
                    </div>

                    {/* Shop CTA */}
                    <div className="mt-6 sm:mt-8 rounded-2xl bg-button/15 border border-button/25 p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div>
                        <h3 className="text-sm font-semibold text-text">Need more UC?</h3>
                        <p className="text-xs text-text/50 mt-1">
                          Browse the shop and top up your game credits instantly.
                        </p>
                      </div>
                      <Link
                        href="/shop"
                        className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold text-white shrink-0
                          bg-gradient-to-r from-button via-cyan-700 to-indigo-700
                          shadow-[0_4px_24px_rgba(14,116,144,0.45)] hover:scale-[1.02] active:scale-[0.99] transition"
                      >
                        Browse shop
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </Link>
                    </div>
                  </>
                )}
              </div>
            </div>
          </GlassPanel>
        </div>
      </div>
    </div>
  );
};

export default Account;
