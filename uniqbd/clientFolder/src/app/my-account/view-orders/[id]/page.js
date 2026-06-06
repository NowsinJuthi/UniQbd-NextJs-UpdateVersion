"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import MenuPage from "../../menu/page";
import { useParams } from "next/navigation";
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

const Row = ({ label, value }) => (
  <div className="flex justify-between items-center text-sm py-2.5 border-b border-button/15 last:border-0 gap-4">
    <span className="text-text/55 text-xs uppercase tracking-wider font-medium shrink-0">
      {label}
    </span>
    <span className="text-text font-medium truncate max-w-[240px] sm:max-w-sm md:max-w-md text-right capitalize">
      {value}
    </span>
  </div>
);

const getStatusConfig = (status) => {
  switch (status) {
    case "completed":
      return {
        badge: "bg-emerald-600/35 border-emerald-500/50 text-emerald-300",
        glow: "shadow-[0_0_24px_rgba(16,185,129,0.3)]",
        hero: "from-emerald-600/25 via-transparent to-button/10",
        icon: "text-emerald-300",
        iconBg: "from-emerald-500/50 to-emerald-700/30 border-emerald-400/40",
        label: "Order completed",
      };
    case "pending":
      return {
        badge: "bg-amber-500/30 border-amber-400/50 text-amber-300",
        glow: "shadow-[0_0_24px_rgba(245,158,11,0.25)]",
        hero: "from-amber-500/20 via-transparent to-button/10",
        icon: "text-amber-300",
        iconBg: "from-amber-500/40 to-amber-700/25 border-amber-400/40",
        label: "Order pending",
      };
    default:
      return {
        badge: "bg-red-500/30 border-red-400/50 text-red-300",
        glow: "shadow-[0_0_24px_rgba(239,68,68,0.25)]",
        hero: "from-red-500/20 via-transparent to-button/10",
        icon: "text-red-300",
        iconBg: "from-red-500/40 to-red-700/25 border-red-400/40",
        label: "Order issue",
      };
  }
};

const ViewPage = () => {
  const params = useParams();
  const id = params.id;
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notes, setNotes] = useState([]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/order/${id}`, { withCredentials: true });
      setOrder(res.data.order);
      setNotes(res.data.order.notes || []);
    } catch (err) {
      console.log(err);
      setError("Failed to load order");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="relative min-h-screen overflow-hidden flex items-center justify-center px-6">
        <div className="pointer-events-none fixed inset-0 -z-10">
          <div className="absolute top-[-10%] left-[-5%] w-[45vw] h-[45vw] rounded-full bg-button/45 blur-[120px] animate-pulse" />
          <div className="absolute bottom-[-15%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-indigo-600/30 blur-[140px]" />
        </div>
        <GlassPanel className="px-10 py-8">
          <div className="flex items-center gap-3">
            <span className="w-5 h-5 border-2 border-button/30 border-t-button rounded-full animate-spin" />
            <span className="text-sm text-text/60">Loading order...</span>
          </div>
        </GlassPanel>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative min-h-screen overflow-hidden flex items-center justify-center px-6 sm:px-12 md:px-20">
        <GlassPanel className="max-w-md w-full">
          <div className="p-8 sm:p-10 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-red-500/20 border border-red-500/30 flex items-center justify-center">
              <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-text mb-2">Could not load order</h2>
            <p className="text-sm text-text/55 mb-6">{error}</p>
            <Link
              href="/my-account/orders"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-button text-white text-sm font-medium shadow-[0_4px_28px_rgba(14,116,144,0.55)] hover:scale-[1.02] transition"
            >
              Back to orders
            </Link>
          </div>
        </GlassPanel>
      </div>
    );
  }

  if (!order) return null;

  const subtotal =
    order?.products?.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    ) || 0;

  const status = getStatusConfig(order.order_status);
  const formattedDate = new Date(order.createdAt).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Ambient background */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute top-[-10%] left-[-5%] w-[45vw] h-[45vw] rounded-full bg-button/45 blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-15%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-indigo-600/30 blur-[140px]" />
        <div className="absolute top-[30%] right-[10%] w-[28vw] h-[28vw] rounded-full bg-cyan-500/15 blur-[110px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(14,116,144,0.15),transparent_55%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-button/10 via-transparent to-button/15" />
      </div>

      <div className="relative py-8 sm:py-10 md:py-12 px-4 sm:px-8 md:px-12 lg:px-20 xl:px-28">
        <div className="max-w-7xl mx-auto">
          <GlassPanel glow>
            <div className="grid md:grid-cols-12">
              <MenuPage />

              <div className="md:col-span-9 p-5 sm:p-8 md:p-10 lg:p-12">
                {/* Back link */}
                <Link
                  href="/my-account/orders"
                  className="inline-flex items-center gap-1.5 text-xs text-text/50 hover:text-button transition mb-5"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back to orders
                </Link>

                {/* Status hero */}
                <div className="relative rounded-2xl p-px bg-gradient-to-br from-button/40 via-cyan-500/15 to-button/25 mb-6 sm:mb-8">
                  <div className={`relative rounded-[0.95rem] overflow-hidden p-6 sm:p-8 bg-imgcard/90 border border-button/20`}>
                    <div className={`absolute inset-0 bg-gradient-to-br ${status.hero} pointer-events-none`} />
                    <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
                      <div className="flex items-center gap-4">
                        <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br ${status.iconBg} flex items-center justify-center shadow-lg`}>
                          <svg className={`w-7 h-7 sm:w-8 sm:h-8 ${status.icon}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-[10px] sm:text-xs uppercase tracking-widest text-text/50 mb-1">
                            {status.label}
                          </p>
                          <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold text-text tracking-tight">
                            Order #{order.orderNumber}
                          </h1>
                          <p className="text-sm text-text/60 mt-1">{formattedDate}</p>
                        </div>
                      </div>
                      <span
                        className={`inline-flex self-start px-4 py-2 rounded-xl border text-xs font-bold uppercase tracking-wider ${status.badge} ${status.glow}`}
                      >
                        {order.order_status}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Details grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6 lg:gap-8 mb-6 sm:mb-8">
                  <GlassPanel>
                    <div className="p-5 sm:p-7 md:p-8">
                      <h2 className="text-base sm:text-lg font-semibold text-text tracking-tight mb-1">
                        Order summary
                      </h2>
                      <p className="text-xs text-text/50 mb-5">Customer &amp; payment details</p>

                      <div className="rounded-2xl bg-button/15 border border-button/25 p-4 shadow-inner shadow-button/15">
                        <Row label="Customer" value={order.customerName || "—"} />
                        <Row label="Email" value={order.customerEmail || "—"} />
                        <Row label="Payment method" value={order.paymentMethod} />
                        <Row label="Payment number" value={order.paymentNumber} />
                        <Row label="Transaction ID" value={order.paymentId || "N/A"} />
                      </div>

                      <div className="mt-5 flex justify-between items-center rounded-2xl bg-button/25 border border-button/35 p-4">
                        <span className="text-sm text-text/65 font-medium">Total paid</span>
                        <span className="text-xl sm:text-2xl font-semibold text-button tabular-nums drop-shadow-[0_0_12px_rgba(14,116,144,0.35)]">
                          {order.totalAmt ?? subtotal}
                          <span className="text-sm text-text/55 font-normal ml-1">TK</span>
                        </span>
                      </div>
                    </div>
                  </GlassPanel>

                  <GlassPanel>
                    <div className="p-5 sm:p-7 md:p-8">
                      <div className="flex items-center justify-between mb-5">
                        <div>
                          <h2 className="text-base sm:text-lg font-semibold text-text tracking-tight">
                            Items
                          </h2>
                          <p className="text-xs text-text/50 mt-0.5">
                            {order.products?.length || 0} product{(order.products?.length || 0) !== 1 ? "s" : ""}
                          </p>
                        </div>
                        <div className={`px-2.5 py-1 rounded-lg border text-[10px] font-bold uppercase tracking-wider ${status.badge}`}>
                          {order.order_status}
                        </div>
                      </div>

                      <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1 [scrollbar-width:thin]">
                        {order.products?.map((item, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-2xl bg-button/20 border border-button/25 hover:border-button/40 transition"
                          >
                            {item.image ? (
                              <img
                                src={item.image}
                                alt={item.productTitle}
                                className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl object-cover border border-button/35 shrink-0"
                              />
                            ) : (
                              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-button/30 border border-button/35 flex items-center justify-center shrink-0">
                                <svg className="w-5 h-5 text-text/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                </svg>
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-text truncate">
                                {item.productTitle}
                              </p>
                            <p className="text-[11px] text-text/50 tabular-nums mt-0.5">
                              {item.price} TK × {item.quantity}
                              {item.package ? ` · ${item.package}` : ""}
                            </p>
                            {item.playerId && (
                              <p className="text-[10px] text-button/80 mt-0.5">
                                Player ID: {item.playerId}
                              </p>
                            )}
                            </div>
                            <p className="text-sm font-semibold text-emerald-400 shrink-0 tabular-nums">
                              {item.subTotal ?? item.price * item.quantity}
                              <span className="text-[10px] text-text/40 font-normal ml-0.5">TK</span>
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </GlassPanel>
                </div>

                {/* Admin notes */}
                {notes.length > 0 && (
                  <GlassPanel className="mb-6 sm:mb-8">
                    <div className="p-5 sm:p-7">
                      <div className="flex items-center gap-3 mb-5">
                        <div className="w-8 h-8 rounded-xl bg-amber-500/30 border border-amber-400/40 flex items-center justify-center">
                          <svg className="w-4 h-4 text-amber-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                          </svg>
                        </div>
                        <div>
                          <h2 className="text-base font-semibold text-text">Messages from admin</h2>
                          <p className="text-xs text-text/50">Updates about your order</p>
                        </div>
                      </div>
                      <div className="space-y-3">
                        {notes.map((note) => (
                          <div
                            key={note._id}
                            className="rounded-2xl bg-amber-500/10 border border-amber-500/25 p-4 sm:p-5"
                          >
                            <p className="font-semibold text-text text-sm">{note.title}</p>
                            <p className="text-sm text-text/65 mt-1.5 leading-relaxed">{note.text}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </GlassPanel>
                )}

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link
                    href="/my-account/orders"
                    className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl text-sm font-semibold text-white transition-all
                      bg-gradient-to-r from-button via-cyan-700 to-indigo-700
                      shadow-[0_4px_28px_rgba(14,116,144,0.55),inset_0_1px_0_rgba(255,255,255,0.25)]
                      hover:shadow-[0_6px_36px_rgba(14,116,144,0.65)] hover:scale-[1.01] active:scale-[0.99]"
                  >
                    All orders
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Link>
                  <Link
                    href="/shop"
                    className="flex-1 flex items-center justify-center py-3.5 rounded-2xl text-sm font-medium text-text
                      bg-button/15 border border-button/35 hover:bg-button/25 hover:border-button/50 transition"
                  >
                    Continue shopping
                  </Link>
                </div>
              </div>
            </div>
          </GlassPanel>
        </div>
      </div>
    </div>
  );
};

export default ViewPage;
