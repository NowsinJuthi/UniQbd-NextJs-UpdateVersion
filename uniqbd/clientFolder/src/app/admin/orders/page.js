"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import AdminMenuPage from "../Menu/page";
import OrderNotifications from "../OrderNotifications/page";
import { playNotificationSound } from "@/utils/sound";
import socket from "@/utils/socket";

const Orders = () => {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("all");

  const [selectedOrders, setSelectedOrders] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("pending");


  const [search, setSearch] = useState("");

  useEffect(() => {
    socket.on("new-order", (data) => {
      playNotificationSound();
      console.log("NEW ORDER:", data);
    });

    return () => socket.off("new-order");
  }, []);

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

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get(
        "https://uniqbd-nextjs-updateversion-backend.onrender.com/api/v1/orders",
        {
          withCredentials: true,
        }
      );
      setOrders(data.orders || []);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchOrders();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const toggleSelect = (id) => {
    setSelectedOrders((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const updateSelectedStatus = async () => {
    try {
      await Promise.all(
        selectedOrders.map((id) =>
          axios.put(
            `https://uniqbd-nextjs-updateversion-backend.onrender.com/api/v1/order/status/${id}`,
            { order_status: selectedStatus },
            { withCredentials: true }
          )
        )
      );

      setSelectedOrders([]);
      fetchOrders();
    } catch (error) {
      console.log(error);
    }
  };

  // ✅ UPDATED FILTER (STATUS + NOTE SEARCH)
  const filteredOrders = orders.filter((order) => {
    const statusMatch =
      filter === "all" || order.order_status === filter;

    const noteMatch =
      !search ||
      order.notes?.some(
        (n) =>
          n.title?.toLowerCase().includes(search.toLowerCase()) ||
          n.text?.toLowerCase().includes(search.toLowerCase())
      );

    return statusMatch && noteMatch;
  });

  const total = orders.length;
  const pending = orders.filter((o) => o.order_status === "pending").length;
  const processing = orders.filter(
    (o) => o.order_status === "processing"
  ).length;
  const completed = orders.filter((o) => o.order_status === "completed").length;
  const deleted = orders.filter((o) => o.order_status === "deleted").length;

  const getStatusColor = (status) => {
    switch (status) {
      case "processing":
        return "bg-blue-500/20 text-blue-400";
      case "completed":
        return "bg-green-500/20 text-green-400";
      case "deleted":
        return "bg-red-500/20 text-red-400";
      default:
        return "bg-yellow-500/20 text-yellow-400";
    }
  };

  return (
    <div className="grid grid-cols-12 gap-6 p-6 bg-[#0b0f19] text-white min-h-screen">

      <OrderNotifications fetchOrders={fetchOrders} />

      <div className="md:col-span-3 p-6 border-r border-white/10">
        <AdminMenuPage />
      </div>

      <div className="col-span-12 md:col-span-9">
        <h1 className="text-3xl font-bold mb-6">Orders Dashboard</h1>

        {/* ✅ SEARCH INPUT (NEW) */}
        <input
          type="text"
          placeholder="Search by note..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-3 mb-6 w-full rounded-xl bg-white/5 border border-white/10 outline-none"
        />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="p-4 rounded-xl bg-white/5 border border-white/10">
            <p className="text-white/50 text-sm">Total Orders</p>
            <h2 className="text-2xl font-bold">{total}</h2>
          </div>

          <div className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
            <p className="text-yellow-400 text-sm">Pending</p>
            <h2 className="text-2xl font-bold">{pending}</h2>
          </div>

          <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
            <p className="text-blue-400 text-sm">Processing</p>
            <h2 className="text-2xl font-bold">{processing}</h2>
          </div>

          <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20">
            <p className="text-green-400 text-sm">Completed</p>
            <h2 className="text-2xl font-bold">{completed}</h2>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 mb-6">
          <button onClick={() => setFilter("all")} className="px-4 py-2 rounded bg-white/10">
            All ({total})
          </button>

          <button onClick={() => setFilter("pending")} className="px-4 py-2 rounded bg-yellow-500/20 text-yellow-400">
            Pending
          </button>

          <button onClick={() => setFilter("processing")} className="px-4 py-2 rounded bg-blue-500/20 text-blue-400">
            Processing
          </button>

          <button onClick={() => setFilter("completed")} className="px-4 py-2 rounded bg-green-500/20 text-green-400">
            Completed
          </button>

          <button onClick={() => setFilter("deleted")} className="px-4 py-2 rounded bg-red-500/20 text-red-400">
            Deleted
          </button>
        </div>

        {selectedOrders.length > 0 && (
          <div className="mb-4 flex gap-3 items-center bg-white/5 p-3 rounded-xl">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="p-2 rounded bg-black border border-white/10"
            >
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="completed">Completed</option>
              <option value="deleted">Deleted</option>
            </select>

            <button
              onClick={updateSelectedStatus}
              className="bg-orange-500 px-4 py-2 rounded text-white"
            >
              Update ({selectedOrders.length})
            </button>
          </div>
        )}

        <div className="overflow-x-auto rounded-xl border border-white/10">
          <table className="w-full text-left">
            <thead className="bg-white/5">
              <tr>
                <th className="p-4">Select</th>
                <th className="p-4">Order</th>
                <th className="p-4">Time</th>
                <th className="p-4">Status</th>
                <th className="p-4">Amount</th>
                <th className="p-4 text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order._id} className="border-t border-white/10 hover:bg-white/5">
                  <td className="p-4">
                    <input
                      type="checkbox"
                      checked={selectedOrders.includes(order._id)}
                      onChange={() => toggleSelect(order._id)}
                    />
                  </td>

                  <td className="p-4 font-semibold">
                    #{order._id.slice(-6)}
                  </td>

                  <td className="p-4 text-white/60">
                    {timeAgo(order.createdAt)}
                  </td>

                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs ${getStatusColor(order.order_status)}`}>
                      {order.order_status}
                    </span>
                  </td>

                  <td className="p-4 font-semibold">
                    {order.totalAmt} TK
                  </td>

                  <td className="p-4 text-center">
                    <button
                      onClick={() =>
                        router.push(`/admin/orders/view-orders/${order._id}`)
                      }
                      className="px-3 py-1 bg-orange-500 rounded"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Orders;