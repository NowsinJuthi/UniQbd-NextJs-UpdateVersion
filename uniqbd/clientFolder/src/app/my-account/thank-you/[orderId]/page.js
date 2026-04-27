"use client";

import axios from "axios";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

const ThankYou = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:3001/api/v1/order/${orderId}`,
          { withCredentials: true }
        );

        setOrder(data.order);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    if (orderId) fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="animate-pulse text-lg">Loading your order...</div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-400 bg-black">
        Order not found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black flex items-center justify-center px-4 py-10 text-white">

      <div className="w-full max-w-3xl rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl p-6 md:p-8">

        {/* SUCCESS HEADER */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 bg-green-500/10 text-green-400 px-4 py-1 rounded-full text-sm border border-green-500/20">
            ✅ Payment Successful
          </div>

          <h1 className="text-3xl font-bold mt-4">
            🎉 Thank You for Your Order
          </h1>

          <p className="text-white/60 mt-2 text-sm">
            Your order has been placed successfully. We are processing it now.
          </p>
        </div>

        {/* ORDER CARD */}
        <div className="grid md:grid-cols-2 gap-4">

          {/* LEFT - ORDER INFO */}
          <div className="bg-white/5 rounded-2xl p-4 border border-white/10 space-y-3">

            <h2 className="font-semibold text-lg mb-2">Order Details</h2>

            <Info label="Order ID" value={order._id} />
            <Info label="Customer" value={order.customerName} />
            <Info label="Email" value={order.customerEmail} />
            <Info label="Payment Method" value={order.paymentMethod} />
            <Info label="Payment Number" value={order.paymentNumber} />
            <Info label="Transaction ID" value={order.paymentId} />

            <div className="flex justify-between pt-2 border-t border-white/10">
              <span className="text-white/60">Total</span>
              <span className="text-green-400 font-bold text-lg">
                {order.totalAmt} TK
              </span>
            </div>
          </div>

          {/* RIGHT - PRODUCTS */}
          <div className="bg-white/5 rounded-2xl p-4 border border-white/10">

            <h2 className="font-semibold text-lg mb-3">Products</h2>

            <div className="space-y-2 max-h-64 overflow-auto pr-1">

              {order.products?.map((p, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center bg-white/5 hover:bg-white/10 transition p-3 rounded-xl border border-white/10"
                >
                  <span className="text-sm">{p.name}</span>
                  <span className="text-xs text-white/70 bg-black/40 px-2 py-1 rounded-full">
                    Qty: {p.quantity}
                  </span>
                </div>
              ))}

            </div>
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex flex-col md:flex-row gap-3 mt-6">

          <Link
            href="/my-account/orders"
            className="flex-1 text-center bg-gradient-to-r from-green-500 to-emerald-600 py-3 rounded-xl font-medium hover:opacity-90 transition"
          >
            View My Orders
          </Link>

          <Link
            href="/"
            className="flex-1 text-center border border-white/20 py-3 rounded-xl hover:bg-white/10 transition"
          >
            Continue Shopping
          </Link>

        </div>

      </div>
    </div>
  );
};

const Info = ({ label, value }) => (
  <div className="flex justify-between text-sm border-b border-white/5 pb-2">
    <span className="text-white/60">{label}</span>
    <span className="font-medium text-white truncate max-w-[180px] text-right">
      {value}
    </span>
  </div>
);

export default ThankYou;