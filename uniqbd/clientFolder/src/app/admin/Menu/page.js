"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";

import {
  FaUser,
  FaBoxOpen,
  FaSignOutAlt,
  FaChartLine,
  FaChevronDown,
  FaChevronUp,
  FaUsers,
  FaNotesMedical,
} from "react-icons/fa";

import { IoSettingsSharp } from "react-icons/io5";
import { AiFillPicture, AiFillProduct } from "react-icons/ai";
import { MdRateReview } from "react-icons/md";

import { RiCoupon3Fill } from "react-icons/ri";
import { BsFillCreditCardFill } from "react-icons/bs";
import { TbReportAnalytics } from "react-icons/tb";


const AdminMenuPage = () => {
  const pathname = usePathname();
  const [openMenu, setOpenMenu] = useState(null);

  const menuItems = [
    { href: "/admin", name: "Dashboard", icon: <FaChartLine /> },

    {
      name: "Orders",
      icon: <FaBoxOpen />,
      children: [
        { href: "/admin/orders", name: "All Orders" },
        { href: "/admin/orders/pending", name: "Pending Orders" },
        { href: "/admin/orders/processing", name: "Processing" },
        { href: "/admin/orders/completed", name: "Completed" },
        { href: "/admin/orders/cancelled", name: "Cancelled" },
      ],
    },

    {
      name: "Products",
      icon: <AiFillProduct />,
      children: [
        { href: "/admin/all-products", name: "All Products" },
        { href: "/admin/products", name: "Add Product" },
        { href: "/admin/categories", name: "Categories" },
        { href: "/admin/brands", name: "Brands" },
        { href: "/admin/stock", name: "Stock Management" },
        { href: "/admin/bulk-upload", name: "Bulk Upload" },
      ],
    },

    {
      name: "Customers",
      icon: <FaUsers />,
      children: [
        { href: "/admin/all-users", name: "All Users" },
        { href: "/admin/customers", name: "Customer Details" },
        { href: "/admin/user-activity", name: "User Activity" },
      ],
    },

    {
      name: "Payments",
      icon: <BsFillCreditCardFill />,
      children: [
        { href: "/admin/payments", name: "Payment History" },
        { href: "/admin/refunds", name: "Refund Requests" },
        { href: "/admin/earnings", name: "Earnings" },
      ],
    },

    {
      name: "Marketing",
      icon: <RiCoupon3Fill />,
      children: [
        { href: "/admin/coupons", name: "Coupons" },
        { href: "/admin/flash-sale", name: "Flash Sale" },
        { href: "/admin/featured", name: "Featured Products" },
        { href: "/admin/homeSlider", name: "Home Sliders" },
        { href: "/admin/email-campaign", name: "Email Campaigns" },
      ],
    },

    {
      name: "Reports",
      icon: <TbReportAnalytics />,
      children: [
        { href: "/admin/sales-report", name: "Sales Report" },
        { href: "/admin/top-products", name: "Top Products" },
        { href: "/admin/low-stock", name: "Low Stock Alerts" },
      ],
    },

    { href: "/admin/notes", name: "Add Note", icon: <FaNotesMedical /> },

    { href: "/admin/reviews", name: "Reviews", icon: <MdRateReview /> },

    {
      name: "Setting",
      icon: <IoSettingsSharp />,
      children: [
        { href: "/admin/mail-set-up", name: "Mail Set up" },
        { href: "/admin/general-settings", name: "General Settings" },
        { href: "/admin/payment-settings", name: "Payment Settings" },
        { href: "/admin/seo-settings", name: "SEO Settings" },
        {
          href: "/admin/homeSlider",
          name: "Home Sliders",
          icon: <AiFillPicture />,
        },
      ],
    },
  ];

  const toggleMenu = (name) => {
    setOpenMenu((prev) => (prev === name ? null : name));
  };

  useEffect(() => {
    menuItems.forEach((item) => {
      if (item.children) {
        const isChildActive = item.children.some(
          (child) => child.href === pathname,
        );
        if (isChildActive) {
          setOpenMenu(item.name);
        }
      }
    });
  }, [pathname]);

  const isActive = (href) => pathname === href;

  return (
    <aside className="w-full md:col-span-3 md:sticky md:top-0">
      <div className="bg-gradient-to-b from-imgcard to-background border-r border-white/10 p-4 md:p-6 rounded-lg flex flex-col justify-between md:h-full">

        {/* Profile Section */}
        <div>
          <div className="flex flex-col items-center text-center mb-6 md:mb-8">
            <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-button flex items-center justify-center text-white text-lg md:text-xl shadow-lg">
              <FaUser />
            </div>

            <p className="mt-3 font-semibold text-text">My Account</p>
            <span className="text-xs opacity-60">UniQbd User</span>
          </div>

          {/* Menu */}
          <nav className="space-y-2 text-sm max-h-[65vh] md:max-h-none overflow-y-auto pr-1">
            {menuItems.map((item) => {
              if (!item.children) {
                return (
                  <Link key={item.href} href={item.href}>
                    <div
                      className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all
                    ${isActive(item.href)
                          ? "bg-button text-white shadow-md shadow-button/30"
                          : "hover:bg-white/5 text-text/80"
                        }`}
                    >
                      <span className="text-base shrink-0">{item.icon}</span>
                      <span className="truncate">{item.name}</span>
                    </div>
                  </Link>
                );
              }

              const isOpen = openMenu === item.name;

              return (
                <div key={item.name} className="space-y-1">
                  <button
                    onClick={() => toggleMenu(item.name)}
                    className="w-full flex items-center justify-between gap-3 p-3 rounded-xl cursor-pointer hover:bg-white/5 text-text/80 transition"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-base shrink-0">{item.icon}</span>
                      <span className="truncate">{item.name}</span>
                    </div>

                    {isOpen ? (
                      <FaChevronUp className="shrink-0" />
                    ) : (
                      <FaChevronDown className="shrink-0" />
                    )}
                  </button>

                  {isOpen && (
                    <div className="ml-6 md:ml-8 mt-1 space-y-1 border-l border-white/10 pl-3">
                      {item.children.map((sub) => (
                        <Link key={sub.href} href={sub.href}>
                          <div
                            className={`p-2 rounded-lg cursor-pointer text-sm transition
                          ${isActive(sub.href)
                                ? "bg-button text-white"
                                : "hover:bg-white/5 text-text/70"
                              }`}
                          >
                            {sub.name}
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </div>

        {/* Logout */}
        <div className="mt-6">
          <button className="flex items-center justify-center md:justify-start gap-3 w-full p-3 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition">
            <FaSignOutAlt />
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
};
export default AdminMenuPage;