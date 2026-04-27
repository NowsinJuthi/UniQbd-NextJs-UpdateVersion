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
import axios from "axios";

const Account = () => {
  const [user, setUser] = useState(null);


  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(
          "https://uniqbd-nextjs-updateversion-backend.onrender.com/api/v1/user",
          {
            withCredentials: true,
          }
        );

        setUser(res.data.data);
      } catch (error) {
        console.log("Profile fetch error:", error);
      }
    };

    fetchProfile();
  }, []);

  //Logout Function
  const handleLogout = async () => {
    try {
      await axios.get(
        "https://uniqbd-nextjs-updateversion-backend.onrender.com/api/v1/logout",
        {
          withCredentials: true,
        }
      );

      // redirect after logout
      window.location.href = "/login";
    } catch (error) {
      console.log("Logout error:", error);
    }
  };

  return (
    <div className="min-h-screen py-10 px-4">
      <div className="max-w-7xl mx-auto rounded-2xl overflow-hidden border border-white/10 shadow-xl">
        <div className="grid md:grid-cols-12">
          {/* menu */}
          <MenuPage />

          {/* Content */}
          <div className="md:col-span-9 p-8 bg-gradient-to-br from-background via-imgcard to-background">
            
            {/* ✅ Dynamic Name (Design same, just added name) */}
            <h1 className="text-3xl font-bold mb-2 text-text">
              Welcome back{user?.name ? `, ${user.name}` : ""}
            </h1>

            <p className="text-text/70 mb-8 max-w-xl">
              Manage your orders, update your address, and edit your account
              details from here.
            </p>

            {/* dashboard cards */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              
              {/* Orders */}
              <Link href="/my-account/orders">
                <div className="group p-6 shadow-inner shadow-button/10 rounded-2xl border border-white/10 bg-gradient-to-br from-package/40 to-package/10 backdrop-blur-xl hover:border-button transition-all cursor-pointer">
                  <FaBoxOpen className="text-2xl mb-3 text-button group-hover:scale-110 transition" />
                  <h3 className="text-lg font-semibold text-text">Orders</h3>
                  <p className="text-sm text-text/60 mt-1">
                    View and track your orders
                  </p>
                </div>
              </Link>

              {/* Address */}
              <Link href="/my-account/address">
                <div className="group p-6 shadow-inner shadow-button/10 rounded-2xl border border-white/10 bg-gradient-to-br from-package/40 to-package/10 backdrop-blur-xl hover:border-button transition-all cursor-pointer">
                  <FaMapMarkerAlt className="text-2xl mb-3 text-button group-hover:scale-110 transition" />
                  <h3 className="text-lg font-semibold text-text">Address</h3>
                  <p className="text-sm text-text/60 mt-1">
                    Manage shipping address
                  </p>
                </div>
              </Link>

              {/* account */}
              <Link href="/my-account/edit-account">
                <div className="group p-6 shadow-inner shadow-button/10 rounded-2xl border border-white/10 bg-gradient-to-br from-package/40 to-package/10 backdrop-blur-xl hover:border-button transition-all cursor-pointer">
                  <FaUser className="text-2xl mb-3 text-button group-hover:scale-110 transition" />
                  <h3 className="text-lg font-semibold text-text">
                    Account Details
                  </h3>
                  <p className="text-sm text-text/60 mt-1">
                    Update profile info
                  </p>
                </div>
              </Link>

              {/* logout */}
              <div
                onClick={handleLogout}
                className="group p-6 shadow-inner shadow-button/10 rounded-2xl border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 transition cursor-pointer"
              >
                <FaSignOutAlt className="text-2xl mb-3 text-red-400 group-hover:scale-110 transition" />
                <h3 className="text-lg font-semibold text-red-400">Logout</h3>
                <p className="text-sm text-red-300/70 mt-1">
                  Secure sign out
                </p>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;