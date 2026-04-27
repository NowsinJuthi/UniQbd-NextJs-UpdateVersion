"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import MenuPage from "../menu/page";

const EditAccount = () => {
  const [form, setForm] = useState({
    name: "",
    mobile: "",
    avatar: "",
  });

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("accessToken");

        const res = await axios.get("http://localhost:3001/api/v1/user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });

        setForm({
          name: res.data.data.name || "",
          mobile: res.data.data.mobile || "",
          avatar: res.data.data.avatar || "",
        });
      } catch (error) {
        console.log(error);
      }
    };

    fetchUser();
  }, []);

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("accessToken");

      await axios.put(
        "http://localhost:3001/api/v1/update-profile",
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Profile updated");
    } catch (error) {
      alert(error.response?.data?.message || "Error");
    }
  };

  const handlePasswordChange = async () => {
    try {
      const token = localStorage.getItem("accessToken");

      await axios.put(
        "http://localhost:3001/api/v1/change-password",
        {
          currentPassword,
          newPassword,
          confirmPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Password updated");

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      alert(error.response?.data?.message || "Error");
    }
  };

  return (
    <div className="min-h-screen py-10 px-4">
      <div className="max-w-7xl mx-auto rounded-2xl overflow-hidden border border-white/10 shadow-xl">
        <div className="grid md:grid-cols-12">
          {/* Sidebar */}
          <MenuPage />

          {/* Content */}
          <div className="md:col-span-9 p-8 bg-gradient-to-br from-background via-imgcard to-background">
            <h1 className="text-3xl font-bold text-text mb-6">
              Account Settings
            </h1>

            {/* Account form */}
            <div className="bg-gradient-to-br from-package/15 to-package/20 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-lg">
              <h2 className="text-xl font-semibold text-text mb-6">
                Profile Information
              </h2>

              <div className="space-y-5">
                {/* mobile */}
                <div>
                  <label className="text-sm text-text/70 block mb-2">
                    Mobile Number
                  </label>

                  <input
                    type="text"
                    value={form.mobile}
                    onChange={(e) =>
                      setForm({ ...form, mobile: e.target.value })
                    }
                    placeholder="Enter your mobile number"
                    className="w-full p-3 shadow-inner shadow-button/10 rounded-xl bg-button/10 border border-white/10 focus:border-button focus:ring-1 focus:ring-button outline-none transition"
                  />
                </div>

                {/* first last */}
                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label className="text-sm text-text/70 block mb-2">
                      First Name
                    </label>

                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                      className="w-full p-3 shadow-inner shadow-button/10 rounded-xl bg-button/10 border border-white/10 focus:border-button focus:ring-1 focus:ring-button outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="text-sm text-text/70 block mb-2">
                      Last Name
                    </label>

                    <input
                      type="text"
                      className="w-full p-3 shadow-inner shadow-button/10 rounded-xl bg-button/10 border border-white/10 focus:border-button focus:ring-1 focus:ring-button outline-none transition"
                    />
                  </div>
                </div>

                {/* display */}
                <div>
                  <label className="text-sm text-text/70 block mb-2">
                    Display Name
                  </label>

                  <input
                    type="text"
                    className="w-full p-3 shadow-inner shadow-button/10 rounded-xl bg-button/10 border border-white/10 focus:border-button focus:ring-1 focus:ring-button outline-none transition"
                  />

                  <p className="text-xs opacity-60 mt-2">
                    This name will appear publicly in your account
                  </p>
                </div>

                {/* email */}
                <div>
                  <label className="text-sm text-text/70 block mb-2">
                    Email Address
                  </label>

                  <input
                    type="email"
                    className="w-full p-3 shadow-inner shadow-button/10 rounded-xl bg-button/10 border border-white/10 focus:border-button focus:ring-1 focus:ring-button outline-none transition"
                  />
                </div>
              </div>
            </div>

            {/* password */}
            <div className="bg-gradient-to-br from-package/15 to-package/20 backdrop-blur-xl border border-white/10 rounded-2xl p-6 mt-8 shadow-lg">
              <h2 className="text-xl font-semibold text-text mb-6">
                Password Change
              </h2>

              <div className="space-y-5">
                <input
                  type="password"
                  placeholder="Current Password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full p-3 shadow-inner shadow-button/10 rounded-xl bg-button/10 border border-white/10 focus:border-button focus:ring-1 focus:ring-button outline-none transition"
                />

                <input
                  type="password"
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full p-3 shadow-inner shadow-button/10 rounded-xl bg-button/10 border border-white/10 focus:border-button focus:ring-1 focus:ring-button outline-none transition"
                />

                <input
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full p-3 shadow-inner shadow-button/10 rounded-xl bg-button/10 border border-white/10 focus:border-button focus:ring-1 focus:ring-button outline-none transition"
                />
              </div>
            </div>

            {/* save */}
            <button
              onClick={handleUpdate}
              className="mt-8 bg-button hover:scale-105 transition px-8 py-3 rounded-xl text-white shadow-lg shadow-button/40 font-medium"
            >
              Save Changes
            </button>

            {/* password button */}
            <button
              onClick={handlePasswordChange}
              className="mt-4 ml-4 bg-button hover:scale-105 transition px-8 py-3 rounded-xl text-white shadow-lg shadow-button/40 font-medium"
            >
              Update Password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditAccount;