"use client";

import React, { useEffect, useState } from "react";

import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";
import MenuPage from "../menu/page";

const Orders = () => {
  const timeAgo = (date) => {
    const now = new Date();
    const created = new Date(date);
    const diff = Math.floor((now - created) / 1000);

    if (diff < 60) return `${diff} sec ago`;
    const minutes = Math.floor(diff / 60);
    if (minutes < 60) return `${minutes} min ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hours ago`;
    const days = Math.floor(hours / 24);
    return `${days} days ago`;
  };

  const router = useRouter();

  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await axios.get(
          "https://uniqbd-nextjs-updateversion-backend.onrender.com/api/v1/my-orders",
          {
            withCredentials: true,
          },
        );

        setOrders(data.orders);
      } catch (error) {
        console.log(error);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="min-h-screen py-10 px-4">
      <div className="max-w-7xl mx-auto rounded-2xl overflow-hidden border border-white/10 shadow-xl">
        <div className="grid md:grid-cols-12">
          <MenuPage />

          {/* content */}
          <div className="md:col-span-9 p-4 sm:p-8 bg-gradient-to-br from-background via-imgcard to-background">
            <h1 className="text-3xl font-bold mb-6 text-text">My Orders</h1>

            {/* TABLE (Desktop) + CARD (Mobile) */}
            <div className="rounded-xl overflow-hidden border border-white/10">
              {/* Desktop Table */}
              <table className="w-full text-sm hidden md:table">
                <thead>
                  <tr className="bg-button text-white">
                    <th className="p-4 text-left">Order</th>
                    <th className="p-4 text-left">Date</th>
                    <th className="p-4 text-left">Status</th>
                    <th className="p-4 text-left">Total</th>
                    <th className="p-4 text-center">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {orders.map((order) => (
                    <tr
                      key={order._id}
                      className="border-t hover:bg-button/10 transition"
                    >
                      <td className="p-4 font-semibold">
                        #{order._id.slice(-6)}
                      </td>

                      <td className="p-4 text-button/80">
                        {timeAgo(order.createdAt)}
                      </td>

                      <td className="p-4">
                        <span className="bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded-full text-xs font-medium">
                          {order.order_status}
                        </span>
                      </td>

                      <td className="p-4 font-medium">{order.totalAmt} TK</td>

                      <td className="p-4 text-center text-white">
                        <button
                          onClick={() =>
                            router.push(`/my-account/view-orders/${order._id}`)
                          }
                          className="bg-button hover:bg-orange-600 px-4 py-2 rounded-lg text-sm transition"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Mobile Cards */}
              <div className="md:hidden space-y-4 p-4">
                {orders.map((order) => (
                  <div
                    key={order._id}
                    className="border border-white/10 rounded-xl p-4 hover:bg-button/10 transition"
                  >
                    <div className="flex justify-between mb-2">
                      <span className="font-semibold">
                        #{order._id.slice(-6)}
                      </span>

                      <span className="text-xs text-button/80">
                        {timeAgo(order.createdAt)}
                      </span>
                    </div>

                    <div className="mb-3">
                      <span className="bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded-full text-xs font-medium">
                        {order.order_status}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="font-medium">{order.totalAmt} TK</span>

                      <button
                        onClick={() =>
                          router.push(`/my-account/view-orders/${order._id}`)
                        }
                        className="bg-button hover:bg-orange-600 px-4 py-2 rounded-lg text-sm transition"
                      >
                        View
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Orders;
