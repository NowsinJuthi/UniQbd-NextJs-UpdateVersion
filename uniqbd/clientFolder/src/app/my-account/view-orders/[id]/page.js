"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import MenuPage from "../../menu/page";
import { useParams } from "next/navigation";

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

      const res = await axios.get(`http://localhost:3001/api/v1/order/${id}`, {
        withCredentials: true,
      });

      console.log(res)
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
      <div className="flex justify-center items-center h-screen text-white">
        Loading order...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-400">
        {error}
      </div>
    );
  }

  if (!order) return null;

  const subtotal =
    order?.products?.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    ) || 0;

  const statusColor =
    order.order_status === "completed"
      ? "bg-green-500/20 text-green-400"
      : order.order_status === "pending"
        ? "bg-yellow-500/20 text-yellow-400"
        : "bg-red-500/20 text-red-400";

  return (
    <div className="min-h-screen py-10 px-4">
      <div className="max-w-7xl mx-auto rounded-2xl overflow-hidden border border-white/10 shadow-xl">
        <div className="grid md:grid-cols-12">
          <MenuPage />

          {/* MAIN */}
          <div className="md:col-span-9 p-8">
            <h1 className="text-3xl font-bold mb-6">Order Details</h1>

            {/* ORDER INFO */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <p className="font-medium">Order Number:</p>
                <span className="font-semibold">#{order._id.slice(-6)}</span>
              </div>

              <div>
                <p className="font-medium">Date:</p>
                <span>{new Date(order.createdAt).toLocaleDateString()}</span>
              </div>

              <div>
                <p className="font-medium">Order Status:</p>
                <span className={`px-3 py-1 rounded ${statusColor}`}>
                  {order.order_status}
                </span>
              </div>

              <div>
                <p className="font-medium">Payment Method:</p>
                <span>{order.paymentMethod}</span>
              </div>

              <div>
                <p className="font-medium">Payment Number:</p>
                <span>{order.paymentNumber}</span>
              </div>

              <div>
                <p className="font-medium">Transaction ID:</p>
                <span>{order.paymentId || "N/A"}</span>
              </div>
            </div>

            {/* CUSTOMER NOTES */}
            {notes.length > 0 && (
              <div className="mt-6 p-4 border rounded-xl">
                <h2 className="text-lg font-bold mb-3">Messages from Admin</h2>

                {notes.map((note) => (
                  <div key={note._id} className="mb-3 p-3 rounded">
                    <p className="font-semibold">{note.title}</p>
                    <p className="text-sm">{note.text}</p>
                  </div>
                ))}
              </div>
            )}

            {/* PRODUCTS */}
            <div className="rounded-xl border overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-800 text-white">
                    <th className="p-4 text-left">Product</th>
                    <th className="p-4 text-left">Price</th>
                    <th className="p-4 text-left">Qty</th>
                    <th className="p-4 text-left">Total</th>
                  </tr>
                </thead>

                <tbody>
                  {order.products.map((item, idx) => (
                    <tr key={idx} className="border-t">
                      <td className="p-4 font-semibold">{item.productTitle}</td>

                      <td className="p-4">{item.price} TK</td>

                      <td className="p-4">{item.quantity}</td>

                      <td className="p-4 font-semibold">
                        {item.price * item.quantity} TK
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* TOTAL */}
            <div className="text-right mt-6">
              <p className="text-lg font-bold">Subtotal: {subtotal} TK</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewPage;
