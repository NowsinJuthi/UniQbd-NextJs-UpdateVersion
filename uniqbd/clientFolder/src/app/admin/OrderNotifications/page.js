"use client";

import socket from "@/utils/socket";
import { useEffect, useState, useRef } from "react";

const OrderNotifications = ({ fetchOrders }) => {
  const [notifications, setNotifications] = useState([]);
  const lastOrderIdRef = useRef(null); 

  const playSound = () => {
    const audio = new Audio("/ding.mp3");
    audio.volume = 1;

    audio.play().catch((err) => {
      console.log("Sound blocked:", err);
    });
  };

  useEffect(() => {
    const handleNewOrder = (data) => {
      const orderId = data?.order?._id;


      if (lastOrderIdRef.current === orderId) return;

      lastOrderIdRef.current = orderId;

      console.log("NEW ORDER:", data);

      setNotifications((prev) => [data, ...prev]);

      if (fetchOrders) fetchOrders();

      playSound();

      setTimeout(() => {
        setNotifications((prev) => prev.slice(1));
      }, 5000);
    };

    socket.on("new-order", handleNewOrder);

    return () => {
      socket.off("new-order", handleNewOrder);
    };
  }, []);

  return (
    <div className="fixed top-5 right-5 space-y-2 z-50">
      {notifications.map((n, i) => (
        <div
          key={i}
          className="bg-green-600 text-white px-4 py-3 rounded shadow-lg animate-bounce"
        >
          <div className="font-semibold">🛒 New Order Received</div>
          <div className="text-sm">
            Order: #{n.order?._id?.slice(-6)}
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrderNotifications