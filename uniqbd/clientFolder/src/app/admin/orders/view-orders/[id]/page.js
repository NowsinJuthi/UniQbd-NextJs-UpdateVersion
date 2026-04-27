"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import AdminMenuPage from "@/app/admin/Menu/page";


const ViewPage = () => {
  const { id } = useParams();

  const [order, setOrder] = useState(null);
  const [allNotes, setAllNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState("");
  const [customMessage, setCustomMessage] = useState("");
  const [newStatus, setNewStatus] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await axios.get(
          `https://uniqbd-nextjs-updateversion-backend.onrender.com/api/v1/order/${id}`,
          { withCredentials: true },
        );

        setOrder(data.order);
        setNewStatus(data.order.order_status);
      } catch (error) {
        console.log(error);
      }
    };

    if (id) fetchOrder();
  }, [id]);

  useEffect(() => {
    const fetchAllNotes = async () => {
      try {
        const { data } = await axios.get(
          `https://uniqbd-nextjs-updateversion-backend.onrender.com/api/v1/all-notes`,
          { withCredentials: true },
        );

        setAllNotes(data.notes || []);
      } catch (error) {
        console.log(error);
      }
    };

    fetchAllNotes();
  }, []);

  const updateStatus = async (orderId, status) => {
    try {
      await axios.put(
        `https://uniqbd-nextjs-updateversion-backend.onrender.com/api/v1/order/status/${orderId}`,
        { order_status: status },
        { withCredentials: true },
      );

      setOrder((prev) => ({ ...prev, order_status: status }));
      setNewStatus(status);

      alert("Status updated successfully!");
    } catch (error) {
      console.log(error);
    }
  };

  const sendNoteToCustomer = async () => {
    try {
      if (!selectedNote && !customMessage.trim()) return;

      await axios.post(
        `https://uniqbd-nextjs-updateversion-backend.onrender.com/api/v1/send-notes-to-customer`,
        {
          orderId: id,
          noteIds: selectedNote ? [selectedNote] : [],
          customMessage,
        },
        { withCredentials: true },
      );

      alert("Message sent to customer!");

      setSelectedNote("");
      setCustomMessage("");
    } catch (error) {
      console.log(error);
    }
  };

  if (!order) return <p className="p-6">Loading...</p>;

  return (
    <div className="grid grid-cols-12 gap-6 p-6 min-h-screen">
      {/* SIDEBAR */}
      <div className="md:col-span-3 p-6 border-r bg-button/5 rounded-xl">
        <AdminMenuPage />
      </div>

      {/* MAIN */}
      <div className="col-span-12 md:col-span-9 space-y-6">
        {/* HEADER */}
        <div className="bg-button/5 p-6 rounded-2xl">
          <h1 className="text-2xl font-bold">Order Details</h1>
          <p className="text-gray-400 mt-1">
            Manage order status & customer communication
          </p>
        </div>

        {/* ORDER INFO CARD */}
        <div className="bg-button/5 p-6 rounded-2xl space-y-2">
          <p>
            <b>Order:</b> #{order._id.slice(-6)}
          </p>
          <p>
            <b>Status:</b> {order.order_status}
          </p>
          <p>
            <b>Total:</b> {order.totalAmt} TK
          </p>
        </div>

        {/* PRODUCTS TABLE CARD */}
        <div className="bg-button/5 p-6 rounded-2xl overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/10">
                <th className="p-3">Product</th>
                <th className="p-3">Price</th>
                <th className="p-3">Qty</th>
              </tr>
            </thead>

            <tbody>
              {order.products.map((p, i) => (
                <tr key={i} className="border-b border-white/10">
                  <td className="p-3">{p.productTitle}</td>
                  <td className="p-3">{p.price}</td>
                  <td className="p-3">{p.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* STATUS UPDATE CARD */}
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

        {/* NOTE SECTION CARD */}
        <div className="bg-button/5 p-6 rounded-2xl space-y-4">
          <h2 className="text-lg font-bold">Send Note / Message to Customer</h2>

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

          {selectedNote && (
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <b>{allNotes.find((n) => n._id === selectedNote)?.title}</b>
              <p className="text-sm text-gray-400">
                {allNotes.find((n) => n._id === selectedNote)?.text}
              </p>
            </div>
          )}

          <button
            onClick={sendNoteToCustomer}
            className="bg-green-600 text-white px-6 py-2 rounded-xl"
          >
            Send to Customer
          </button>
        </div>
        {/* SENT NOTES HISTORY */}
        <div className="bg-button/5 p-6 rounded-2xl space-y-4">
          <h2 className="text-lg font-bold">Sent Notes</h2>

          {order.notes && order.notes.length > 0 ? (
            order.notes.map((note) => (
              <div
                key={note._id}
                className="p-4 rounded-xl bg-white/5 border border-white/10"
              >
                <b>{note.title}</b>
                <p className="text-sm text-gray-400 mt-1">{note.text}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-400">No notes sent yet</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewPage;
