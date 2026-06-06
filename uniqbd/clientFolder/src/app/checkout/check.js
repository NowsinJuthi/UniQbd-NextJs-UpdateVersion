"use client";

import { CartContext } from "@/context/CartContext";
import React, { useContext, useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import api from "@/utils/api";

const PAYMENT_METHODS = [
  {
    name: "bKash",
    value: "bkash",
    glow: "shadow-[0_0_32px_rgba(226,19,110,0.55)]",
    ring: "ring-[#E2136E]/70",
    gradient: "from-[#E2136E]/45 via-[#E2136E]/20 to-transparent",
    border: "from-[#E2136E]/60 via-[#E2136E]/30 to-[#E2136E]/10",
    bg: "bg-[#E2136E]/25",
  },
  {
    name: "Nagad",
    value: "nagad",
    glow: "shadow-[0_0_32px_rgba(246,146,30,0.55)]",
    ring: "ring-[#F6921E]/70",
    gradient: "from-[#F6921E]/45 via-[#F6921E]/20 to-transparent",
    border: "from-[#F6921E]/60 via-[#F6921E]/30 to-[#F6921E]/10",
    bg: "bg-[#F6921E]/25",
  },
  {
    name: "Rocket",
    value: "rocket",
    glow: "shadow-[0_0_32px_rgba(139,47,151,0.55)]",
    ring: "ring-[#8B2F97]/70",
    gradient: "from-[#8B2F97]/45 via-[#8B2F97]/20 to-transparent",
    border: "from-[#8B2F97]/60 via-[#8B2F97]/30 to-[#8B2F97]/10",
    bg: "bg-[#8B2F97]/25",
  },
];

const LOCATIONS = ["Dhaka", "Chattogram", "Rajshahi", "Sylhet"];

const STEPS = [
  { label: "Cart", href: "/cart", active: false },
  { label: "Checkout", active: true },
  { label: "Done", active: false },
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

const SectionHeader = ({ step, title, subtitle }) => (
  <div className="flex items-start gap-4 mb-6">
    <div className="shrink-0 w-8 h-8 rounded-xl bg-button/40 border border-button/50 flex items-center justify-center text-xs font-bold text-white shadow-[0_0_20px_rgba(14,116,144,0.45)]">
      {step}
    </div>
    <div>
      <h2 className="text-base sm:text-lg font-semibold text-text tracking-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="text-xs sm:text-sm text-text/65 mt-0.5 font-normal">
          {subtitle}
        </p>
      )}
    </div>
  </div>
);

const FieldLabel = ({ children, optional }) => (
  <label className="block text-[11px] sm:text-xs font-medium uppercase tracking-wider text-text/70 mb-2">
    {children}
    {optional && (
      <span className="normal-case tracking-normal text-text/30 ml-1">
        (optional)
      </span>
    )}
  </label>
);

const inputClass =
  "w-full bg-button/15 text-base sm:text-sm text-text placeholder:text-text/35 rounded-2xl px-4 py-3 outline-none border border-button/30 shadow-inner shadow-button/20 transition-all duration-200 hover:border-button/45 hover:bg-button/20 focus:border-button/60 focus:bg-button/25 focus:shadow-[0_0_0_3px_rgba(14,116,144,0.25),inset_0_1px_0_rgba(255,255,255,0.08)]";

const Checkout = () => {
  const router = useRouter();

  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [note, setNote] = useState("");
  const [paymentNumber, setPaymentNumber] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  const { cart, removeFromCart, updateQuantity, subtotal, clearCart } =
    useContext(CartContext);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const validEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validMobile = (mobile) => /^01\d{9}$/.test(mobile);

  const changeQuantity = (index, delta) => {
    const newQty = cart[index].quantity + delta;
    if (newQty >= 1) updateQuantity(index, newQty);
  };

  const removeItem = (index) => removeFromCart(index);

  const handlePlaceOrder = async () => {
    try {
      if (!name) return toast.error("Enter your name");
      if (!location) return toast.error("Select your location");
      if (!validMobile(mobile))
        return toast.error("Enter valid 11 digit mobile number");
      if (!validEmail(email)) return toast.error("Enter valid email");
      if (!paymentMethod) return toast.error("Select payment method");
      if (!validMobile(paymentNumber))
        return toast.error("Enter valid payment number");
      if (!transactionId) return toast.error("Enter transaction ID");
      if (cart.length === 0) return toast.error("Cart is empty");

      setLoading(true);

      const token = localStorage.getItem("accessToken");

      const { data } = await api.post(
        "/order/create",
        {
          products: cart,
          customerName: name,
          customerEmail: email,
          customerLocation: location,
          customerMobile: mobile,
          orderNote: note,
          paymentMethod,
          paymentNumber,
          paymentId: transactionId,
          totalAmt: subtotal,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        },
      );

      toast.success("Order placed successfully!");
      clearCart();
      router.push(`/my-account/thank-you/${data.order._id}`);
    } catch (error) {
      console.log(error);
      toast.error("Order failed!");
    } finally {
      setLoading(false);
    }
  };

  if (!hasMounted) return null;

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Ambient liquid glass background */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute top-[-10%] left-[-5%] w-[45vw] h-[45vw] rounded-full bg-button/45 blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-15%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-indigo-600/30 blur-[140px]" />
        <div className="absolute top-[40%] right-[20%] w-[25vw] h-[25vw] rounded-full bg-cyan-500/25 blur-[100px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(14,116,144,0.15),transparent_55%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-button/10 via-transparent to-button/15" />
      </div>

      <div className="relative py-8 sm:py-12 md:py-16 px-3 sm:px-5">
        <div className="max-w-6xl mx-auto">
          {/* Header — Linear + VisionOS */}
          <div className="mb-8 sm:mb-10">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-button/25 border border-button/40 backdrop-blur-md mb-4">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,1)] animate-pulse" />
                  <span className="text-[10px] sm:text-xs font-medium text-text/80 uppercase tracking-widest">
                    Secure Checkout
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl md:text-[2.5rem] font-semibold text-text tracking-[-0.02em] leading-tight">
                  Complete your order
                </h1>
                <p className="text-sm text-text/65 mt-2 max-w-md">
                  Gaming credits delivered fast. Pay with bKash, Nagad, or Rocket.
                </p>
              </div>

              {/* Stripe-style step bar */}
              <div className="flex items-center gap-1 p-1 rounded-2xl bg-imgcard/80 border border-button/30 backdrop-blur-xl shadow-inner shadow-button/20">
                {STEPS.map((step, i) => (
                  <React.Fragment key={step.label}>
                    {step.href ? (
                      <Link
                        href={step.href}
                        className="px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm text-text/40 hover:text-text/70 transition"
                      >
                        {step.label}
                      </Link>
                    ) : (
                      <span
                        className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition ${
                          step.active
                            ? "bg-button/40 text-white border border-button/50 shadow-[0_0_24px_rgba(14,116,144,0.4)]"
                            : "text-text/30"
                        }`}
                      >
                        {step.label}
                      </span>
                    )}
                    {i < STEPS.length - 1 && (
                      <span className="text-text/20 text-xs">/</span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>

          {cart.length === 0 ? (
            <GlassPanel glow className="max-w-lg mx-auto">
              <div className="p-10 sm:p-14 text-center">
                <div className="w-20 h-20 mx-auto mb-5 rounded-[1.5rem] bg-gradient-to-br from-button/60 to-indigo-600/40 border border-button/40 flex items-center justify-center shadow-[0_0_48px_rgba(14,116,144,0.45)]">
                  <svg className="w-9 h-9 text-text/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-text mb-2 tracking-tight">
                  Cart is empty
                </h2>
                <p className="text-sm text-text/45 mb-8">
                  Add UC or game items before checking out.
                </p>
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-button text-white text-sm font-medium hover:scale-[1.03] active:scale-[0.98] transition shadow-[0_4px_28px_rgba(14,116,144,0.55)]"
                >
                  Browse Store
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </GlassPanel>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 items-start">
              {/* LEFT — Form flow (Stripe layout) */}
              <div className="lg:col-span-7 space-y-5">
                {/* Billing */}
                <GlassPanel>
                  <div className="p-5 sm:p-7">
                    <SectionHeader
                      step="1"
                      title="Billing details"
                      subtitle="Order confirmation will be sent here"
                    />
                    <div className="space-y-4">
                      <div>
                        <FieldLabel>Full name</FieldLabel>
                        <input
                          type="text"
                          placeholder="Your name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className={inputClass}
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <FieldLabel>Location</FieldLabel>
                          <select
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            className={inputClass}
                          >
                            <option value="">Select city</option>
                            {LOCATIONS.map((loc) => (
                              <option key={loc} value={loc}>
                                {loc}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <FieldLabel>Mobile</FieldLabel>
                          <input
                            type="tel"
                            placeholder="01XXXXXXXXX"
                            value={mobile}
                            onChange={(e) => setMobile(e.target.value)}
                            className={inputClass}
                          />
                        </div>
                      </div>

                      <div>
                        <FieldLabel>Email</FieldLabel>
                        <input
                          type="email"
                          placeholder="you@email.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className={inputClass}
                        />
                      </div>

                      <div>
                        <FieldLabel optional>Order notes</FieldLabel>
                        <textarea
                          placeholder="Player ID, special instructions..."
                          rows="2"
                          value={note}
                          onChange={(e) => setNote(e.target.value)}
                          className={`${inputClass} resize-none`}
                        />
                      </div>
                    </div>
                  </div>
                </GlassPanel>

                {/* Payment method — Gaming store cards */}
                <GlassPanel>
                  <div className="p-5 sm:p-7">
                    <SectionHeader
                      step="2"
                      title="Payment method"
                      subtitle="Choose your mobile wallet"
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {PAYMENT_METHODS.map((method) => {
                        const selected = paymentMethod === method.value;
                        return (
                          <label
                            key={method.value}
                            className={`group relative cursor-pointer rounded-2xl p-px transition-all duration-300
                              ${selected ? `bg-gradient-to-br ${method.border} scale-[1.02] ${method.glow}` : "bg-button/20 hover:bg-button/30"}`}
                          >
                            <input
                              type="radio"
                              name="payment"
                              value={method.value}
                              checked={selected}
                              onChange={(e) => setPaymentMethod(e.target.value)}
                              className="hidden"
                            />
                            <div
                              className={`relative rounded-[0.9rem] p-4 overflow-hidden transition-all
                                ${selected ? `${method.bg} ring-2 ${method.ring}` : "bg-button/15 group-hover:bg-button/25"}`}
                            >
                              {selected && (
                                <div className={`absolute inset-0 bg-gradient-to-br ${method.gradient} pointer-events-none`} />
                              )}
                              <div className="relative flex items-center justify-between gap-2">
                                <span className="font-semibold text-text text-sm">
                                  {method.name}
                                </span>
                                <div
                                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition
                                    ${selected ? "border-button bg-button/50" : "border-button/30"}`}
                                >
                                  {selected && (
                                    <div className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.9)]" />
                                  )}
                                </div>
                              </div>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                </GlassPanel>

                {/* Payment info */}
                <GlassPanel>
                  <div className="p-5 sm:p-7">
                    <SectionHeader
                      step="3"
                      title="Payment details"
                      subtitle="Send payment then enter your transaction info"
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <FieldLabel>Payment number</FieldLabel>
                        <input
                          type="text"
                          placeholder="01XXXXXXXXX"
                          value={paymentNumber}
                          onChange={(e) => setPaymentNumber(e.target.value)}
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <FieldLabel>Transaction ID</FieldLabel>
                        <input
                          type="text"
                          placeholder="TRX123ABC456"
                          value={transactionId}
                          onChange={(e) => setTransactionId(e.target.value)}
                          className={inputClass}
                        />
                      </div>
                    </div>

                    {paymentMethod && (
                      <div className="mt-5 flex items-center gap-3 rounded-2xl bg-emerald-600/20 border border-emerald-500/40 p-3.5 backdrop-blur-sm shadow-inner shadow-emerald-500/10">
                        <div className="w-7 h-7 rounded-lg bg-emerald-500/35 flex items-center justify-center shrink-0">
                          <svg className="w-3.5 h-3.5 text-emerald-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <p className="text-xs text-text/60">
                          Paying with{" "}
                          <span className="font-semibold text-text capitalize">
                            {paymentMethod}
                          </span>
                        </p>
                      </div>
                    )}
                  </div>
                </GlassPanel>
              </div>

              {/* RIGHT — Order summary (VisionOS floating panel) */}
              <div className="lg:col-span-5">
                <div className="lg:sticky lg:top-20">
                  <GlassPanel glow>
                    <div className="p-5 sm:p-6">
                      <div className="flex items-center justify-between mb-5">
                        <div>
                          <h2 className="text-sm font-semibold text-text tracking-tight">
                            Order summary
                          </h2>
                          <p className="text-[11px] text-text/40 mt-0.5">
                            {cart.length} item{cart.length !== 1 ? "s" : ""}
                          </p>
                        </div>
                        <div className="px-2.5 py-1 rounded-lg bg-button/35 border border-button/50 text-[10px] font-bold text-white uppercase tracking-wider shadow-[0_0_16px_rgba(14,116,144,0.3)]">
                          Live
                        </div>
                      </div>

                      {/* Cart items */}
                      <div className="space-y-2.5 max-h-[280px] overflow-y-auto pr-0.5 [scrollbar-width:thin]">
                        {cart.map((product, index) => (
                          <div
                            key={index}
                            className="group relative rounded-2xl p-3 bg-button/20 border border-button/25 hover:border-button/40 hover:bg-button/30 transition-all duration-200 shadow-inner shadow-button/15"
                          >
                            <div className="flex gap-3">
                              <div className="relative shrink-0">
                                <img
                                  src={product.img}
                                  alt={product.name}
                                  className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl object-cover border border-button/35"
                                />
                                <div className="absolute -inset-0.5 rounded-xl bg-button/50 blur-md opacity-0 group-hover:opacity-100 transition -z-10" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3 className="text-sm font-medium text-text truncate leading-tight">
                                  {product.name}
                                </h3>
                                <p className="text-[11px] text-text/40 mt-0.5 truncate">
                                  {product.package}
                                </p>
                                <button
                                  onClick={() => removeItem(index)}
                                  className="text-[11px] text-red-400/80 hover:text-red-400 mt-1 transition"
                                >
                                  Remove
                                </button>
                              </div>
                              <p className="text-sm font-semibold text-text shrink-0 tabular-nums">
                                {product.price * product.quantity}
                                <span className="text-[10px] text-text/40 font-normal ml-0.5">TK</span>
                              </p>
                            </div>

                            <div className="mt-2.5 flex items-center justify-between pt-2.5 border-t border-button/20">
                              <span className="text-[11px] text-text/35 tabular-nums">
                                {product.price} TK × {product.quantity}
                              </span>
                              <div className="flex items-center gap-1.5">
                                <button
                                  onClick={() => changeQuantity(index, -1)}
                                  className="w-6 h-6 flex items-center justify-center rounded-lg bg-button/30 border border-button/40 text-white hover:bg-button/50 hover:border-button/60 transition text-sm"
                                >
                                  −
                                </button>
                                <span className="text-xs font-medium text-text w-5 text-center tabular-nums">
                                  {product.quantity}
                                </span>
                                <button
                                  onClick={() => changeQuantity(index, 1)}
                                  className="w-6 h-6 flex items-center justify-center rounded-lg bg-button/30 border border-button/40 text-white hover:bg-button/50 hover:border-button/60 transition text-sm"
                                >
                                  +
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Totals — Stripe style */}
                      <div className="mt-5 pt-4 border-t border-button/30 space-y-2">
                        <div className="flex justify-between text-xs text-text/60">
                          <span>Subtotal</span>
                          <span className="tabular-nums">{subtotal} TK</span>
                        </div>
                        <div className="flex justify-between items-baseline">
                          <span className="text-sm font-medium text-text">Total due</span>
                          <span className="text-2xl font-semibold text-button tracking-tight tabular-nums drop-shadow-[0_0_12px_rgba(14,116,144,0.4)]">
                            {subtotal}
                            <span className="text-sm text-text/60 font-normal ml-1">TK</span>
                          </span>
                        </div>
                      </div>

                      {/* CTA — Gaming glow button */}
                      <button
                        onClick={handlePlaceOrder}
                        disabled={loading}
                        className="hidden lg:flex w-full mt-5 items-center justify-center gap-2.5 py-3.5 rounded-2xl text-sm font-semibold text-white transition-all duration-200
                          bg-gradient-to-r from-button via-cyan-700 to-indigo-700
                          shadow-[0_4px_28px_rgba(14,116,144,0.55),inset_0_1px_0_rgba(255,255,255,0.25)]
                          hover:shadow-[0_6px_36px_rgba(14,116,144,0.65)] hover:scale-[1.01] active:scale-[0.99]
                          disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:shadow-none"
                      >
                        {loading ? (
                          <>
                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            Place order
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                          </>
                        )}
                      </button>

                      <p className="hidden lg:flex items-center justify-center gap-1.5 text-[10px] text-text/30 mt-3">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        Encrypted &amp; secure payment
                      </p>
                    </div>
                  </GlassPanel>
                </div>

                {/* Mobile sticky bar — VisionOS dock style */}
                <div className="lg:hidden fixed bottom-3 left-3 right-3 z-50">
                  <div className="rounded-[1.5rem] p-px bg-gradient-to-br from-button/60 via-cyan-500/30 to-button/40 shadow-[0_8px_40px_rgba(0,0,0,0.5)]">
                    <div className="rounded-[1.45rem] bg-imgcard/95 backdrop-blur-2xl backdrop-saturate-200 border border-button/35 p-3.5">
                      <div className="flex items-center justify-between mb-2.5 px-0.5">
                        <span className="text-xs text-text/50">Total due</span>
                        <span className="text-lg font-semibold text-button tabular-nums drop-shadow-[0_0_8px_rgba(14,116,144,0.4)]">
                          {subtotal} TK
                        </span>
                      </div>
                      <button
                        onClick={handlePlaceOrder}
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-button via-cyan-700 to-indigo-700 shadow-[0_4px_24px_rgba(14,116,144,0.5)] disabled:opacity-50"
                      >
                        {loading ? (
                          <>
                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Processing...
                          </>
                        ) : (
                          "Place order"
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="lg:hidden h-32" />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Checkout;
