"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FiMenu, FiX } from "react-icons/fi";
import AdminMenuPage from "../Menu/page";
import api from "@/utils/api";
import { getSocket, disconnectSocket } from "@/utils/socket";
import { playNotificationSound } from "@/utils/sound";

const Orders = () => {
  const router = useRouter();

  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("all");

  const [selectedOrders, setSelectedOrders] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("pending");

  const [search, setSearch] = useState("");

  // NEW UX STATES
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [liveConnected, setLiveConnected] = useState(false);
  const [autoSystemOn, setAutoSystemOn] = useState(false);

  // ---------------- TIME FORMAT ----------------
  const timeAgo = (date) => {
    const now = new Date();
    const created = new Date(date);
    const diff = Math.floor((now - created) / 1000);

    if (diff < 60) return `${diff} sec ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
    return `${Math.floor(diff / 86400)} days ago`;
  };

  // ---------------- FETCH ----------------
  const fetchOrders = async () => {
    try {
      const { data } = await api.get(`/orders`, {
        withCredentials: true,
      });

      setOrders(data.orders || []);
    } catch (error) {
      console.log("Fetch orders error:", error);
    }
  };

  useEffect(() => {
    fetchOrders();

    api.get("/auto/status", { withCredentials: true })
      .then(({ data }) => setAutoSystemOn(data.autoOrderEnabled))
      .catch(() => {});
  }, []);

  // REAL-TIME SOCKET (auto new order alerts)
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const onConnect = () => setLiveConnected(true);
    const onDisconnect = () => setLiveConnected(false);

    const onNewOrder = (payload) => {
      playNotificationSound();
      fetchOrders();
      if (payload?.order?.orderNumber) {
        console.log("New order:", payload.order.orderNumber);
      }
    };

    const onStatusUpdate = () => fetchOrders();

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("new-order", onNewOrder);
    socket.on("order-status-updated", onStatusUpdate);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("new-order", onNewOrder);
      socket.off("order-status-updated", onStatusUpdate);
      disconnectSocket();
    };
  }, []);

  // AUTO REFRESH TOGGLE
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      fetchOrders();
    }, 5000);

    return () => clearInterval(interval);
  }, [autoRefresh]);

  // ---------------- SELECT ----------------
  const toggleSelect = (id) => {
    setSelectedOrders((prev) =>
      prev.includes(id)
        ? prev.filter((i) => i !== id)
        : [...prev, id]
    );
  };

  // ---------------- BULK UPDATE ----------------
  const updateSelectedStatus = async () => {
    try {
      await Promise.all(
        selectedOrders.map((id) =>
          api.put(
            `/order/status/${id}`,
            { order_status: selectedStatus },
            { withCredentials: true }
          )
        )
      );

      setSelectedOrders([]);
      fetchOrders();
    } catch (error) {
      console.log("Bulk update error:", error);
    }
  };

  // ---------------- FILTER ----------------
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

  // ---------------- STATUS COLOR ----------------
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
    <div className="relative grid grid-cols-12 gap-4 md:gap-6 p-3 md:p-6 bg-[#0b0f19] text-white min-h-screen">

      {/* MOBILE TOP BAR */}
      <div className="md:hidden col-span-12 flex items-center justify-between mb-3">
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 bg-white/10 rounded"
        >
          <FiMenu />
        </button>

        <button
          onClick={() => setAutoRefresh(!autoRefresh)}
          className={`px-3 py-1 rounded ${
            autoRefresh ? "bg-green-500/20" : "bg-white/10"
          }`}
        >
          Auto {autoRefresh ? "ON" : "OFF"}
        </button>
      </div>

      {/* SIDEBAR (DESKTOP) */}
      <aside className="hidden md:block md:col-span-3 border-r border-white/10">
        <div className="p-6">
          <AdminMenuPage />
        </div>
      </aside>

      {/* MOBILE SIDEBAR DRAWER */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 md:hidden">
          <div className="w-72 h-full bg-[#0b0f19] p-4 border-r border-white/10">
            <button
              onClick={() => setSidebarOpen(false)}
              className="mb-4 p-2 bg-white/10 rounded"
            >
              <FiX />
            </button>

            <AdminMenuPage />
          </div>
        </div>
      )}

      {/* MAIN */}
      <main className="col-span-12 md:col-span-9">

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 md:mb-6">
          <h1 className="text-2xl md:text-3xl font-bold">Orders Dashboard</h1>
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span
              className={`px-3 py-1.5 rounded-full border ${
                liveConnected
                  ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-300"
                  : "bg-white/5 border-white/10 text-white/50"
              }`}
            >
              Live {liveConnected ? "ON" : "OFF"}
            </span>
            <span
              className={`px-3 py-1.5 rounded-full border ${
                autoSystemOn
                  ? "bg-button/20 border-button/30 text-button"
                  : "bg-white/5 border-white/10 text-white/50"
              }`}
            >
              Auto {autoSystemOn ? "ON" : "OFF"}
            </span>
          </div>
        </div>

        {/* SEARCH */}
        <input
          type="text"
          placeholder="Search by note..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-3 mb-6 w-full rounded-xl bg-white/5 border border-white/10 outline-none"
        />

        {/* FILTER */}
        <div className="flex flex-wrap gap-2 mb-6">
          {["all", "pending", "processing", "completed", "deleted"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="px-3 py-2 rounded bg-white/10"
            >
              {f}
            </button>
          ))}
        </div>

        {/* BULK ACTION */}
        {selectedOrders.length > 0 && (
          <div className="mb-4 flex flex-col md:flex-row gap-3 bg-white/5 p-3 rounded-xl">
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
              className="bg-orange-500 px-4 py-2 rounded"
            >
              Update ({selectedOrders.length})
            </button>
          </div>
        )}

        {/* DESKTOP TABLE */}
        <div className="hidden md:block overflow-x-auto border border-white/10 rounded-xl">
          <table className="w-full text-left">
            <thead className="bg-white/5">
              <tr>
                <th className="p-4">Select</th>
                <th className="p-4">Order</th>
                <th className="p-4">Time</th>
                <th className="p-4">Status</th>
                <th className="p-4">Auto</th>
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

                  <td className="p-4">
                    {order.autoProcessed ? (
                      <span className="px-2 py-1 rounded text-[10px] bg-cyan-500/15 text-cyan-300 border border-cyan-500/25">
                        AUTO
                      </span>
                    ) : (
                      <span className="text-white/30 text-xs">—</span>
                    )}
                  </td>

                  <td className="p-4 font-semibold">
                    {order.totalAmt} TK
                  </td>

                  <td className="p-4 text-center">
                    <button
                      onClick={() =>
                        router.push(`/admin/orders/view-orders/${order._id}`)
                      }
                      className="px-3 py-1 bg-button rounded"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* MOBILE CARD VIEW */}
        <div className="md:hidden space-y-3">
          {filteredOrders.map((order) => (
            <div
              key={order._id}
              className="p-4 rounded-xl bg-white/5 border border-white/10"
            >
              <div className="flex justify-between">
                <p className="font-bold">#{order.orderNumber}</p>
                <input
                  type="checkbox"
                  checked={selectedOrders.includes(order._id)}
                  onChange={() => toggleSelect(order._id)}
                />
              </div>

              <p className="text-white/60 text-sm mt-1">
                {timeAgo(order.createdAt)}
              </p>

              <div className="mt-2 flex justify-between items-center">
                <span className={`px-3 py-1 rounded-full text-xs ${getStatusColor(order.order_status)}`}>
                  {order.order_status}
                </span>

                <p className="font-bold">{order.totalAmt} TK</p>
              </div>

              <button
                onClick={() =>
                  router.push(`/admin/orders/view-orders/${order.orderNumber}`)
                }
                className="mt-3 w-full bg-button py-2 rounded"
              >
                View
              </button>
            </div>
          ))}
        </div>

      </main>
    </div>
  );
};

export default Orders;