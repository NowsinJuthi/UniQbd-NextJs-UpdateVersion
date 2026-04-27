"use client";

import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { FiRefreshCw } from "react-icons/fi";

import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import AdminMenuPage from "./Menu/page";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboard = async () => {
    try {
      setLoading(true);

      const res = await axios.get("http://localhost:3001/api/v1/admin", {
        withCredentials: true,
      });

      setStats(res.data);

      const orderRes = await axios.get(
        "http://localhost:3001/api/v1/orders",
        { withCredentials: true }
      );

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


  const monthlyData = useMemo(() => {
    const map = {};

    orders.forEach((order) => {
      const date = new Date(order.createdAt);
      const month = date.toLocaleString("default", { month: "short" });

      if (!map[month]) {
        map[month] = { month, orders: 0, revenue: 0 };
      }

      map[month].orders += 1;
      map[month].revenue += order.totalAmt || 0;
    });

    return Object.values(map);
  }, [orders]);


  const productData = useMemo(() => {
    const map = {};

    orders.forEach((order) => {
      order.products.forEach((p) => {
        const name = p.productTitle;

        if (!map[name]) {
          map[name] = {
            name,
            quantity: 0,
            revenue: 0,
          };
        }

        map[name].quantity += p.quantity;
        map[name].revenue += p.price * p.quantity;
      });
    });

    return Object.values(map).sort((a, b) => b.quantity - a.quantity);
  }, [orders]);

  const topProduct = productData[0];

  return (
    <div className="grid grid-cols-12 gap-6 p-6 min-h-screen">

      {/* Sidebar */}
      <div className="md:col-span-3 p-6 border-r bg-button/5 rounded-xl">
        <AdminMenuPage />
      </div>

      {/* Main */}
      <div className="col-span-12 md:col-span-9">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-bold">Admin Analytics</h1>
            <p className="text-gray-400 mt-1">
              Product & Sales Insights
            </p>
          </div>

          <button
            onClick={fetchDashboard}
            className="flex items-center gap-2 px-4 py-2 bg-button/5 rounded-lg hover:opacity-80 transition"
          >
            <FiRefreshCw className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 text-red-600 rounded-lg">
            {error}
          </div>
        )}

        {/* LOADING */}
        {loading && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-28 bg-button/5 rounded-2xl animate-pulse"
              />
            ))}
          </div>
        )}

        {/* CONTENT */}
        {!loading && stats && (
          <>
            {/* TOP PRODUCT CARD */}
            {topProduct && (
              <div className="mb-8 p-6 bg-button/5 rounded-2xl shadow-lg">
                <h2 className="text-lg font-bold mb-2">
                  Top Selling Product
                </h2>
                <p className="text-2xl font-bold">
                  {topProduct.name}
                </p>
                <p className="text-gray-400">
                  Sold: {topProduct.quantity} pcs | Revenue: {topProduct.revenue} TK
                </p>
              </div>
            )}

            {/* STATS */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">

              <div className="bg-button/5 p-6 rounded-2xl">
                <p className="text-gray-400">Total Orders</p>
                <h2 className="text-3xl font-bold">{stats.totalOrders}</h2>
              </div>

              <div className="bg-button/5 p-6 rounded-2xl">
                <p className="text-gray-400">Customers</p>
                <h2 className="text-3xl font-bold">{stats.totalCustomers}</h2>
              </div>

              <div className="bg-button/5 p-6 rounded-2xl">
                <p className="text-gray-400">Revenue</p>
                <h2 className="text-3xl font-bold">{stats.revenue}</h2>
              </div>
            </div>

            {/* 📊 PRODUCT SALES CHART */}
            <div className="bg-button/5 p-6 rounded-2xl mb-10">
              <h2 className="text-xl font-bold mb-6">
                Product Sales Performance
              </h2>

              <div style={{ width: "100%", height: 350 }}>
                <BarChart width={800} height={350} data={productData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />

                  <Bar dataKey="quantity" fill="#8884d8" />
                  <Bar dataKey="revenue" fill="#82ca9d" />
                </BarChart>
              </div>
            </div>

            {/* 📈 MONTHLY REVENUE */}
            <div className="bg-button/5 p-6 rounded-2xl">
              <h2 className="text-xl font-bold mb-6">
                Monthly Revenue Trend
              </h2>

              <div style={{ width: "100%", height: 350 }}>
                <LineChart width={800} height={350} data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#8884d8"
                    strokeWidth={2}
                  />
                </LineChart>
              </div>
            </div>

          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;