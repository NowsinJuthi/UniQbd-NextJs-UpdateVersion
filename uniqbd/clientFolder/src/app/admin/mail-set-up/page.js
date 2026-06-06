"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import axios from "axios";
import { IoMdMail } from "react-icons/io";
import { FaEnvelopeOpenText, FaPaperPlane } from "react-icons/fa";
import { IoSettingsSharp } from "react-icons/io5";
import AdminMenuPage from "../Menu/page";
import api from "@/utils/api";

const Mailpage = () => {
  const pathname = usePathname();

  

  const [form, setForm] = useState({
    host: "",
    email: "",
    password: "",
    port: "",
    PORT: "",
    MONGODB_URI: "",
    ACCESS_TOKEN_SECRET: "",
    REFRESH_TOKEN_SECRET: "",
    JWT_SECRET: "",
  });

  const menu = [
    {
      href: "/admin/mail-set-up",
      name: "SMTP Setup",
      icon: <IoSettingsSharp />,
    },
    {
      href: "/admin/mail-inbox",
      name: "Inbox",
      icon: <FaEnvelopeOpenText />,
    },
    {
      href: "/admin/mail-send",
      name: "Send Mail",
      icon: <FaPaperPlane />,
    },
  ];

  const isActive = (href) => pathname === href;

  // ---------------- HANDLE CHANGE ----------------
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // ---------------- SAVE SETTINGS ----------------
  const saveSettings = async () => {
    try {
      const res = await api.post(
        `/smtp/save`,
        form,
        { withCredentials: true }
      );

      alert(res.data.message);
    } catch (err) {
      alert("Failed to save settings");
      console.log("SMTP save error:", err);
    }
  };

  // ---------------- TEST CONNECTION ----------------
  const testConnection = async () => {
    try {
      const res = await api.post(
        `/smtp/test`,
        {
          ...form,
          port: Number(form.port),
        },
        { withCredentials: true }
      );

      alert(res.data.message);
    } catch (err) {
      alert(err.response?.data?.error || "SMTP connection failed");
      console.log("SMTP test error:", err);
    }
  };

  // ---------------- FETCH CONFIG ----------------
  useEffect(() => {
    const getConfig = async () => {
      try {
        const res = await api.get(`/smtp/get`, {
          withCredentials: true,
        });

        if (res.data.data) {
          setForm((prev) => ({
            ...prev,
            ...res.data.data,
          }));
        }
      } catch (err) {
        console.log("Fetch SMTP config error:", err);
      }
    };

    getConfig();
  }, []);

  // ---------------- UI ----------------
  return (
    <div className="grid grid-cols-12 gap-6 p-6 min-h-screen">

      {/* SIDEBAR */}
      <div className="col-span-12 md:col-span-3">
        <div className="p-5 bg-button/5 rounded-2xl h-full border">
          <AdminMenuPage />
        </div>
      </div>

      {/* MAIN */}
      <div className="col-span-12 md:col-span-9 space-y-6">

        {/* HEADER */}
        <div className="bg-button/5 p-6 rounded-2xl flex justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-button flex items-center justify-center text-white text-2xl">
              <IoMdMail />
            </div>

            <div>
              <h1 className="text-2xl font-bold">Mail System</h1>
              <p className="text-gray-400 text-sm">
                Manage SMTP • Inbox • Send Emails
              </p>
            </div>
          </div>

          <div className="hidden md:flex gap-3">
            <span className="px-4 py-1.5 bg-button/10 rounded-full text-sm">
              SMTP Active
            </span>
            <span className="px-4 py-1.5 bg-button/10 rounded-full text-sm">
              Secure Mail
            </span>
          </div>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-12 gap-6">

          {/* NAV */}
          <div className="col-span-12 md:col-span-4">
            <div className="bg-button/5 p-5 rounded-2xl border h-full">
              <h2 className="text-lg font-semibold mb-5">
                Mail Navigation
              </h2>

              <div className="space-y-2">
                {menu.map((item) => (
                  <Link key={item.href} href={item.href}>
                    <div
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition
                      ${
                        isActive(item.href)
                          ? "bg-button text-white"
                          : "hover:bg-white/5 text-text/80"
                      }`}
                    >
                      {item.icon}
                      <span>{item.name}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* FORM */}
          <div className="col-span-12 md:col-span-8">
            <div className="bg-button/5 p-6 rounded-2xl border">

              <h2 className="text-xl font-semibold mb-6">
                SMTP Configuration
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                <input
                  name="host"
                  value={form.host}
                  onChange={handleChange}
                  placeholder="SMTP Host"
                  className="p-3 rounded-xl bg-white/5 outline-none"
                />

                <input
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Email"
                  className="p-3 rounded-xl bg-white/5 outline-none"
                />

                <input
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  type="password"
                  placeholder="Password"
                  className="p-3 rounded-xl bg-white/5 outline-none"
                />

                <input
                  name="port"
                  value={form.port}
                  onChange={handleChange}
                  placeholder="Port"
                  className="p-3 rounded-xl bg-white/5 outline-none"
                />

              </div>

              {/* BUTTONS */}
              <div className="flex gap-4 mt-8">

                <button
                  onClick={saveSettings}
                  className="bg-button text-white px-6 py-2.5 rounded-xl"
                >
                  Save Settings
                </button>

                <button
                  onClick={testConnection}
                  className="px-6 py-2.5 rounded-xl bg-white/5"
                >
                  Test Connection
                </button>

              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Mailpage;