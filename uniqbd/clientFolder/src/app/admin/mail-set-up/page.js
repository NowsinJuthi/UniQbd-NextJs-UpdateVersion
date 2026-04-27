"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import axios from "axios";
import { IoMdMail } from "react-icons/io";
import { FaEnvelopeOpenText, FaPaperPlane } from "react-icons/fa";
import { IoSettingsSharp } from "react-icons/io5";
import AdminMenuPage from "../Menu/page";

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

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const saveSettings = async () => {
    try {
      const res = await axios.post(
        "http://localhost:3001/api/v1/smtp/save",
        form
      );
      alert(res.data.message);
    } catch (err) {
      alert("Failed to save settings");
    }
  };

  const testConnection = async () => {
    try {
      const res = await axios.post(
        "http://localhost:3001/api/v1/smtp/test",
        {
          ...form,
          port: Number(form.port),
        }
      );
      alert(res.data.message);
    } catch (err) {
      alert(err.response?.data?.error || "SMTP connection failed");
    }
  };

  useEffect(() => {
    const getConfig = async () => {
      try {
        const res = await axios.get("http://localhost:3001/api/v1/get");
        if (res.data.data) {
          setForm((prev) => ({
            ...prev,
            ...res.data.data,
          }));
        }
      } catch (err) {
        console.log(err);
      }
    };
    getConfig();
  }, []);

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
        <div className="bg-button/5 p-6 rounded-2xl flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-button flex items-center justify-center text-white text-2xl shadow-md">
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

        {/* CONTENT GRID */}
        <div className="grid grid-cols-12 gap-6">

          {/* NAVIGATION */}
          <div className="col-span-12 md:col-span-4">
            <div className="bg-button/5 p-5 rounded-2xl border h-full">
              <h2 className="text-lg font-semibold mb-5">
                Mail Navigation
              </h2>

              <div className="space-y-2">
                {menu.map((item) => (
                  <Link key={item.href} href={item.href}>
                    <div
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                      ${
                        isActive(item.href)
                          ? "bg-button text-white shadow-md shadow-button/30"
                          : "hover:bg-white/5 text-text/80"
                      }`}
                    >
                      <span className="text-lg">{item.icon}</span>
                      <span className="font-medium">{item.name}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* FORM */}
          <div className="col-span-12 md:col-span-8">
            <div className="bg-button/5 p-6 rounded-2xl border shadow-sm">
              <h2 className="text-xl font-semibold mb-6">
                SMTP Configuration
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                <div className="flex flex-col gap-1">
                  <label className="text-sm text-gray-400">SMTP Host</label>
                  <input
                    name="host"
                    value={form.host}
                    onChange={handleChange}
                    type="text"
                    placeholder="smtp.gmail.com"
                    className="p-3 rounded-xl bg-white/5 outline-none focus:ring-2 focus:ring-button"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-sm text-gray-400">SMTP Email</label>
                  <input
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    type="text"
                    placeholder="example@gmail.com"
                    className="p-3 rounded-xl bg-white/5 outline-none focus:ring-2 focus:ring-button"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-sm text-gray-400">SMTP Password</label>
                  <input
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    type="password"
                    placeholder="********"
                    className="p-3 rounded-xl bg-white/5 outline-none focus:ring-2 focus:ring-button"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-sm text-gray-400">Port</label>
                  <input
                    name="port"
                    value={form.port}
                    onChange={handleChange}
                    type="text"
                    placeholder="587"
                    className="p-3 rounded-xl bg-white/5 outline-none focus:ring-2 focus:ring-button"
                  />
                </div>

              </div>

              {/* BUTTONS */}
              <div className="flex gap-4 mt-8">
                <button
                  onClick={saveSettings}
                  className="bg-button text-white px-6 py-2.5 rounded-xl shadow-md hover:opacity-90 transition"
                >
                  Save Settings
                </button>

                <button
                  onClick={testConnection}
                  className="px-6 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 transition"
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