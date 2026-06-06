"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/utils/api";

const STEPS = [
  { label: "Cart", href: "/cart" },
  { label: "Checkout", href: "/checkout" },
  { label: "Done", active: true },
];

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
  <div className="flex justify-between items-center text-sm py-2.5 border-b border-button/15 last:border-0">
    <span className="text-text/55 text-xs uppercase tracking-wider font-medium">
      {label}
    </span>
    <span className="text-text font-medium truncate max-w-[240px] sm:max-w-sm md:max-w-md text-right capitalize">
      {value}
    </span>
  </div>
);

const ThankYou = () => {
  const { orderId } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await api.get(`/order/${orderId}`, {
          withCredentials: true,
        });
        setOrder(data.order);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    if (orderId) fetchOrder();
  }, [orderId]);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await api.get("/user", { withCredentials: true });
        setIsLoggedIn(true);
      } catch {
        setIsLoggedIn(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) {
    return (
      <div className="relative min-h-screen overflow-hidden flex items-center justify-center">
        <div className="pointer-events-none fixed inset-0 -z-10">
          <div className="absolute top-[-10%] left-[-5%] w-[45vw] h-[45vw] rounded-full bg-button/45 blur-[120px] animate-pulse" />
          <div className="absolute bottom-[-15%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-indigo-600/30 blur-[140px]" />
        </div>
        <GlassPanel className="px-10 py-8">
          <div className="flex items-center gap-3">
            <span className="w-5 h-5 border-2 border-button/30 border-t-button rounded-full animate-spin" />
            <span className="text-sm text-text/60">Loading your order...</span>
          </div>
        </GlassPanel>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="relative min-h-screen overflow-hidden flex items-center justify-center px-6 sm:px-12 md:px-20 lg:px-28">
        <div className="pointer-events-none fixed inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-red-950/20 to-transparent" />
        </div>
        <GlassPanel className="max-w-md w-full">
          <div className="p-8 sm:p-10 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-red-500/20 border border-red-500/30 flex items-center justify-center">
              <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-text mb-2">Order not found</h2>
            <p className="text-sm text-text/55 mb-6">
              We couldn&apos;t find this order. It may have been removed or the link is invalid.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-button text-white text-sm font-medium shadow-[0_4px_28px_rgba(14,116,144,0.55)] hover:scale-[1.02] transition"
            >
              Back to Home
            </Link>
          </div>
        </GlassPanel>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Ambient background */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute top-[-10%] left-[-5%] w-[45vw] h-[45vw] rounded-full bg-button/45 blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-15%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-indigo-600/30 blur-[140px]" />
        <div className="absolute top-[30%] left-[30%] w-[30vw] h-[30vw] rounded-full bg-emerald-500/15 blur-[120px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(14,116,144,0.15),transparent_55%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-button/10 via-transparent to-button/15" />
      </div>

      <div className="relative py-8 sm:py-12 md:py-16 px-6 sm:px-10 md:px-16 lg:px-24 xl:px-32">
        <div className="max-w-7xl mx-auto">
          {/* Step bar */}
          <div className="flex items-center justify-center sm:justify-start gap-1 p-1 rounded-2xl bg-imgcard/80 border border-button/30 backdrop-blur-xl shadow-inner shadow-button/20 w-fit mx-auto sm:mx-0 mb-6 sm:mb-8">
            {STEPS.map((step, i) => (
              <span key={step.label} className="flex items-center gap-1">
                {step.href ? (
                  <Link
                    href={step.href}
                    className="px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm text-text/40 hover:text-text/70 transition"
                  >
                    {step.label}
                  </Link>
                ) : (
                  <span
                    className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-medium ${
                      step.active
                        ? "bg-emerald-600/35 text-white border border-emerald-500/50 shadow-[0_0_24px_rgba(16,185,129,0.3)]"
                        : "text-text/30"
                    }`}
                  >
                    {step.label}
                  </span>
                )}
                {i < STEPS.length - 1 && (
                  <span className="text-text/20 text-xs">/</span>
                )}
              </span>
            ))}
          </div>

          {/* Success hero */}
          <GlassPanel glow className="mb-5 sm:mb-6">
            <div className="relative p-8 sm:p-12 md:px-16 text-center overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/20 via-transparent to-button/10 pointer-events-none" />

              <div className="relative">
                <div className="mx-auto w-16 h-16 sm:w-20 sm:h-20 rounded-[1.25rem] bg-gradient-to-br from-emerald-500/50 to-emerald-700/30 border border-emerald-400/40 flex items-center justify-center shadow-[0_0_48px_rgba(16,185,129,0.45)]">
                  <svg className="w-8 h-8 sm:w-10 sm:h-10 text-emerald-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>

                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-600/25 border border-emerald-500/40 mt-5 mb-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,1)] animate-pulse" />
                  <span className="text-[10px] sm:text-xs font-medium text-emerald-300 uppercase tracking-widest">
                    Payment Successful
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-text tracking-tight">
                  Thank you for your order!
                </h1>

                <p className="text-sm sm:text-base text-text/65 mt-2 max-w-md mx-auto">
                  Your order has been placed and is now being processed. You&apos;ll receive your items shortly.
                </p>

                <div className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-button/20 border border-button/30">
                  <span className="text-[10px] sm:text-xs text-text/50 uppercase tracking-wider">
                    Order ID
                  </span>
                  <span className="text-sm font-semibold text-text font-mono">
                    {order.orderNumber}
                  </span>
                </div>

                {!isLoggedIn && (
                  <p className="text-xs text-text/45 mt-4">
                    <Link href="/my-account" className="text-button hover:underline">
                      Create an account
                    </Link>{" "}
                    to track your orders easily
                  </p>
                )}
              </div>
            </div>
          </GlassPanel>

          {/* Order details grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-10">
            {/* Order summary */}
            <GlassPanel>
              <div className="p-6 sm:p-8 md:p-10">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h2 className="text-base sm:text-lg font-semibold text-text tracking-tight">
                      Order summary
                    </h2>
                    <p className="text-xs text-text/50 mt-0.5">Payment &amp; customer details</p>
                  </div>
                  <div className="px-2.5 py-1 rounded-lg bg-emerald-600/30 border border-emerald-500/45 text-[10px] font-bold text-emerald-300 uppercase tracking-wider">
                    Confirmed
                  </div>
                </div>

                <div className="rounded-2xl bg-button/15 border border-button/25 p-4 shadow-inner shadow-button/15">
                  <Row label="Customer" value={order.customerName} />
                  <Row label="Email" value={order.customerEmail} />
                  <Row label="Payment Method" value={order.paymentMethod} />
                  <Row label="Payment Number" value={order.paymentNumber} />
                  <Row label="Transaction ID" value={order.paymentId} />
                </div>

                <div className="mt-5 flex justify-between items-center rounded-2xl bg-button/25 border border-button/35 p-4">
                  <span className="text-sm text-text/65 font-medium">Total paid</span>
                  <span className="text-xl sm:text-2xl font-semibold text-emerald-400 tabular-nums drop-shadow-[0_0_12px_rgba(52,211,153,0.35)]">
                    {order.totalAmt}
                    <span className="text-sm text-text/55 font-normal ml-1">TK</span>
                  </span>
                </div>
              </div>
            </GlassPanel>

            {/* Items */}
            <GlassPanel>
              <div className="p-6 sm:p-8 md:p-10">
                <h2 className="text-base sm:text-lg font-semibold text-text tracking-tight mb-1">
                  Items
                </h2>
                <p className="text-xs text-text/50 mb-4">
                  {order.products?.length || 0} product{(order.products?.length || 0) !== 1 ? "s" : ""}
                </p>

                <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1 [scrollbar-width:thin]">
                  {order.products?.map((p, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-4 p-4 rounded-2xl bg-button/20 border border-button/25 hover:border-button/40 transition"
                    >
                      <img
                        src={p.image}
                        alt={p.productTitle}
                        className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl object-cover border border-button/35 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-text truncate">
                          {p.productTitle}
                        </p>
                        <p className="text-[11px] text-text/50 tabular-nums">
                          {p.price} TK × {p.quantity}
                        </p>
                      </div>
                      <p className="text-sm font-semibold text-emerald-400 shrink-0 tabular-nums">
                        {p.subTotal}
                        <span className="text-[10px] text-text/40 font-normal ml-0.5">TK</span>
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </GlassPanel>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 mt-5 sm:mt-6">
            {isLoggedIn ? (
              <Link
                href="/my-account/orders"
                className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl text-sm font-semibold text-white transition-all
                  bg-gradient-to-r from-button via-cyan-700 to-indigo-700
                  shadow-[0_4px_28px_rgba(14,116,144,0.55),inset_0_1px_0_rgba(255,255,255,0.25)]
                  hover:shadow-[0_6px_36px_rgba(14,116,144,0.65)] hover:scale-[1.01] active:scale-[0.99]"
              >
                View my orders
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            ) : (
              <Link
                href="/"
                className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl text-sm font-semibold text-white transition-all
                  bg-gradient-to-r from-button via-cyan-700 to-indigo-700
                  shadow-[0_4px_28px_rgba(14,116,144,0.55),inset_0_1px_0_rgba(255,255,255,0.25)]
                  hover:shadow-[0_6px_36px_rgba(14,116,144,0.65)] hover:scale-[1.01] active:scale-[0.99]"
              >
                Back to home
              </Link>
            )}

            <Link
              href="/shop"
              className="flex-1 flex items-center justify-center py-3.5 rounded-2xl text-sm font-medium text-text
                bg-button/15 border border-button/35 hover:bg-button/25 hover:border-button/50 transition"
            >
              Continue shopping
            </Link>
          </div>

          <p className="flex items-center justify-center gap-1.5 text-[10px] text-text/35 mt-5">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Your payment was processed securely
          </p>
        </div>
      </div>
    </div>
  );
};

export default ThankYou;
