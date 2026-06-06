"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import api from "@/utils/api";
import AdminMenuPage from "@/app/admin/Menu/page";

const ViewPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [allNotes, setAllNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState("");
  const [customMessage, setCustomMessage] = useState("");
  const [newStatus, setNewStatus] = useState("");

  // ---------------- FETCH ORDER ----------------
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await api.get(`/order/${id}`, {
          withCredentials: true,
        });

        setOrder(data.order);
        setNewStatus(data.order.order_status);
      } catch (error) {
        console.log("Fetch order error:", error);
      }
    };

    if (id) fetchOrder();
  }, [id]);

  // ---------------- FETCH NOTES ----------------
  useEffect(() => {
    const fetchAllNotes = async () => {
      try {
        const { data } = await api.get(`/all-notes`, {
          withCredentials: true,
        });

        setAllNotes(data.notes || []);
      } catch (error) {
        console.log("Fetch notes error:", error);
      }
    };

    fetchAllNotes();
  }, []);

  // ---------------- UPDATE STATUS ----------------
  const updateStatus = async (orderId, status) => {
    try {
      await api.put(
        `/order/status/${orderId}`,
        { order_status: status },
        { withCredentials: true }
      );

      setOrder((prev) => ({ ...prev, order_status: status }));
      setNewStatus(status);

      alert("Status updated successfully!");
    } catch (error) {
      console.log("Update status error:", error);
    }
  };

  // ---------------- SEND NOTE ----------------
  const sendNoteToCustomer = async () => {
    try {
      if (!selectedNote && !customMessage.trim()) return;

      await api.post(
        `/send-notes-to-customer`,
        {
          orderId: id,
          noteIds: selectedNote ? [selectedNote] : [],
          customMessage,
        },
        { withCredentials: true }
      );

      alert("Message sent to customer!");

      setSelectedNote("");
      setCustomMessage("");
    } catch (error) {
      console.log("Send note error:", error);
    }
  };

  if (!order) return <p className="p-6">Loading...</p>;

  // ---------------- UI ----------------
  return (
    <div className="grid grid-cols-12 gap-6 p-6 min-h-screen bg-black/5">

      {/* SIDEBAR */}
      <aside className="md:col-span-3 p-6 border-r bg-button/5 rounded-xl">
        <AdminMenuPage />
      </aside>

      {/* MAIN */}
      <main className="col-span-12 md:col-span-9 space-y-6">

        {/* HEADER */}
        <div className="bg-button/5 p-6 rounded-2xl">
          <h1 className="text-2xl font-bold">Order Details</h1>
          <p className="text-gray-400 mt-1">
            Manage order status & customer communication
          </p>
        </div>

        {/* ORDER INFO */}
        <div className="bg-button/5 p-6 rounded-2xl space-y-2">
          <p><b>Order:</b> #{order.orderNumber}</p>
          <p><b>Status:</b> {order.order_status}</p>
          <p><b>Total:</b> {order.totalAmt} TK</p>
        </div>

        {/* PRODUCTS */}
        {/* PRODUCTS */}
        <div className="overflow-x-auto rounded-xl border border-white/10 mt-4">
          <table className="w-full text-left">

            <thead className="bg-white/5">
              <tr>
                <th className="p-4">Product</th>
                <th className="p-4">Image</th>
                <th className="p-4">Price</th>
                <th className="p-4">Qty</th>
                <th className="p-4">Subtotal</th>
              </tr>
            </thead>

            <tbody>
              {order.products?.map((p, i) => (
                <tr
                  key={i}
                  className="border-t border-white/10 hover:bg-white/5"
                >

                  {/* PRODUCT NAME */}
                  <td className="p-4 font-medium">
                    {p.productTitle}
                  </td>

                  {/* IMAGE */}
                  <td className="p-4">
                    <Image
                      src={p.imgUrl || p.image || "/placeholder.png"}
                      alt={p.productTitle}
                      width={48}
                      height={48}
                      className="w-12 h-12 object-cover rounded-lg border border-white/10"
                      unoptimized
                    />
                  </td>

                  {/* PRICE */}
                  <td className="p-4 text-white/70">
                    {p.price} TK
                  </td>

                  {/* QTY */}
                  <td className="p-4">
                    {p.quantity}
                  </td>

                  {/* SUBTOTAL */}
                  <td className="p-4 font-semibold">
                    {p.price * p.quantity} TK
                  </td>

                </tr>
              ))}
            </tbody>

          </table>
        </div>

        {/* STATUS UPDATE */}
        <div className="bg-button/5 p-6 rounded-2xl flex flex-col md:flex-row gap-4 md:items-center">

          <select
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value)}
            className="p-3 rounded-xl bg-white/5 outline-none"
          >
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <button
            onClick={() => updateStatus(order._id, newStatus)}
            className="bg-button text-white px-6 py-2 rounded-xl"
          >
            Update Status
          </button>

        </div>

        {/* SEND NOTE */}
        <div className="bg-button/5 p-6 rounded-2xl space-y-4">

          <h2 className="text-lg font-bold">
            Send Note / Message to Customer
          </h2>

          <select
            value={selectedNote}
            onChange={(e) => setSelectedNote(e.target.value)}
            className="w-full p-3 rounded-xl bg-white/5 outline-none"
          >
            <option value="">Select Note (Optional)</option>

            {allNotes.map((note) => (
              <option key={note._id} value={note._id}>
                {note.title}
              </option>
            ))}
          </select>

          <textarea
            value={customMessage}
            onChange={(e) => setCustomMessage(e.target.value)}
            placeholder="Write custom message..."
            className="w-full p-3 rounded-xl bg-white/5 outline-none h-28"
          />

          <button
            onClick={sendNoteToCustomer}
            className="bg-button text-white px-6 py-2 rounded-xl"
          >
            Send to Customer
          </button>

        </div>

        {/* SENT NOTES */}
        <div className="bg-button/5 p-6 rounded-2xl space-y-4">

          <h2 className="text-lg font-bold">Sent Notes</h2>

          {order.notes?.length > 0 ? (
            order.notes.map((note) => (
              <div
                key={note._id}
                className="p-4 rounded-xl bg-white/5 border border-white/10"
              >
                <b>{note.title}</b>
                <p className="text-sm text-gray-400 mt-1">
                  {note.text}
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-400">No notes sent yet</p>
          )}

        </div>

      </main>
    </div>
  );
};

export default ViewPage;