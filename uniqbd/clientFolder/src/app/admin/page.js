"use client";

import React, { useEffect, useState, useMemo } from "react";
import { FiRefreshCw } from "react-icons/fi";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

import AdminMenuPage from "./Menu/page";
import api from "@/utils/api";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [viewMode, setViewMode] = useState("monthly");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // ---------------- FETCH ----------------
  const fetchDashboard = async () => {
    try {
      setLoading(true);

      const res = await api.get(`/admin`, { withCredentials: true });
      setStats(res.data);

      const orderRes = await api.get(`/orders`, { withCredentials: true });
      setOrders(orderRes.data.orders || []);
    } catch (err) {
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
    const interval = setInterval(fetchDashboard, 30000);
    return () => clearInterval(interval);
  }, []);

  // ---------------- FILTER ----------------
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const date = new Date(order.createdAt);

      if (fromDate && new Date(fromDate) > date) return false;
      if (toDate && new Date(toDate) < date) return false;

      return true;
    });
  }, [orders, fromDate, toDate]);

  // ---------------- CHART DATA ----------------
  const chartData = useMemo(() => {
    const map = {};

    filteredOrders.forEach((order) => {
      const date = new Date(order.createdAt);

      let key =
        viewMode === "daily"
          ? `${date.getHours()}:00`
          : viewMode === "monthly"
          ? date.getDate()
          : date.toLocaleString("default", { month: "short" });

      if (!map[key]) {
        map[key] = { label: key, orders: 0, revenue: 0 };
      }

      map[key].orders += 1;
      map[key].revenue += order.totalAmt || 0;
    });

    return Object.values(map);
  }, [filteredOrders, viewMode]);

  // ---------------- PRODUCT DATA ----------------
  const productData = useMemo(() => {
    const map = {};

    filteredOrders.forEach((order) => {
      order.products.forEach((p) => {
        const name = p.productTitle;

        if (!map[name]) {
          map[name] = {
            name,
            price: p.price || 0,
            quantity: 0,
            revenue: 0,
          };
        }

        map[name].quantity += p.quantity;
        map[name].revenue += p.price * p.quantity;
      });
    });

    return Object.values(map).sort((a, b) => b.quantity - a.quantity);
  }, [filteredOrders]);

  const topProduct = productData[0];

  // ---------------- MONTH COMPARISON ----------------
  const compareData = useMemo(() => {
    const now = new Date();
    const thisMonth = now.getMonth();
    const lastMonth = thisMonth === 0 ? 11 : thisMonth - 1;
    const year = now.getFullYear();

    let thisMonthTotal = 0;
    let lastMonthTotal = 0;

    orders.forEach((order) => {
      const d = new Date(order.createdAt);

      if (d.getFullYear() === year && d.getMonth() === thisMonth) {
        thisMonthTotal += order.totalAmt || 0;
      }

      if (d.getFullYear() === year && d.getMonth() === lastMonth) {
        lastMonthTotal += order.totalAmt || 0;
      }
    });

    return [
      { name: "This Month", revenue: thisMonthTotal },
      { name: "Last Month", revenue: lastMonthTotal },
    ];
  }, [orders]);

  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6 p-3 md:p-6 min-h-screen">

      {/* SIDEBAR */}
      <div className="col-span-12 md:col-span-3 p-3 md:p-6 border-r bg-button/5 rounded-xl">
        <AdminMenuPage />
      </div>

      {/* MAIN */}
      <div className="col-span-12 md:col-span-9">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Admin Analytics</h1>
            <p className="text-gray-400">Sales Dashboard</p>
          </div>

          <button
            onClick={fetchDashboard}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-button/5 rounded-lg w-full md:w-auto"
          >
            <FiRefreshCw className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        {/* FILTER BUTTONS */}
        <div className="grid grid-cols-3 md:flex gap-2 mb-4">
          {["daily", "monthly", "yearly"].map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`px-3 md:px-4 py-2 rounded-lg text-sm md:text-base ${
                viewMode === mode ? "bg-black text-white" : "bg-button/5"
              }`}
            >
              {mode}
            </button>
          ))}
        </div>

        {/* DATE FILTER */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="w-full p-2 rounded bg-button/5"
          />
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="w-full p-2 rounded bg-button/5"
          />
        </div>

        {/* TOP PRODUCT */}
        {topProduct && (
          <div className="mb-6 p-4 md:p-6 bg-button/5 rounded-2xl">
            <h2 className="font-bold">Top Product</h2>
            <p className="text-lg md:text-xl">{topProduct.name}</p>
            <p className="text-gray-400">
              Sold: {topProduct.quantity} | Revenue: {topProduct.revenue} TK
            </p>
          </div>
        )}

        {/* STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-10">
          <div className="p-4 bg-button/5 rounded-xl">
            Orders: {filteredOrders.length}
          </div>
          <div className="p-4 bg-button/5 rounded-xl">
            Customers: {stats?.totalCustomers}
          </div>
          <div className="p-4 bg-button/5 rounded-xl">
            Revenue:{" "}
            {filteredOrders.reduce((a, b) => a + (b.totalAmt || 0), 0)}
          </div>
        </div>

        {/* CHART */}
        <div className="bg-button/5 p-4 md:p-6 rounded-2xl mb-10 overflow-hidden">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="revenue" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* PRODUCT TABLE */}
        <div className="bg-button/5 p-4 md:p-6 rounded-2xl">
          <h2 className="font-bold mb-4">Sold Products</h2>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] text-left">
              <thead>
                <tr className="border-b">
                  <th className="py-3 px-2">Product</th>
                  <th className="py-3 px-2">Price</th>
                  <th className="py-3 px-2">Qty</th>
                  <th className="py-3 px-2">Revenue</th>
                </tr>
              </thead>

              <tbody>
                {productData.map((p, i) => (
                  <tr key={i} className="border-b">
                    <td className="py-3 px-2">{p.name}</td>
                    <td className="py-3 px-2">{p.price}</td>
                    <td className="py-3 px-2">{p.quantity}</td>
                    <td className="py-3 px-2">{p.revenue}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;