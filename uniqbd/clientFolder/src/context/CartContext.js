"use client";

import React, { createContext, useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    if (typeof window !== "undefined") {
      const savedCart = localStorage.getItem("cart");
      return savedCart ? JSON.parse(savedCart) : [];
    }
    return [];
  });

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // ADD TO CART (NO DUPLICATE + SAFE)
  const addToCart = ({ product, selectedPkg, playerId, quantity }) => {
    if (!selectedPkg) {
      toast.error("⚠️ Please select a package first!");
      return;
    }

    const isTopUp = product.category === "top-up";

    if (isTopUp && (!playerId || playerId.trim() === "")) {
      toast.error("⚠️ Please enter your Player ID!");
      return;
    }

    const itemPrice = Number(
      (selectedPkg?.price ?? 0)
        .toString()
        .replace("TK", "")
        .replace(/,/g, "")
        .trim(),
    );

    let actionType = null;

    setCart((prev) => {
      const existsIndex = prev.findIndex(
        (item) =>
          item.id === product.id &&
          item.package === selectedPkg.uc &&
          item.playerId === (playerId || ""),
      );

      let updatedCart = [...prev];

      if (existsIndex > -1) {
        updatedCart[existsIndex] = {
          ...updatedCart[existsIndex],
          quantity: updatedCart[existsIndex].quantity + (quantity || 1),
        };

        actionType = "updated";
      } else {
        updatedCart.push({
          id: product.id,
          name: product.name,
          img: product.photo
            ? `http://localhost:3001/uploads/${product.photo}`
            : "/placeholder.png",
          package: selectedPkg.uc,
          playerId: playerId || "",
          price: itemPrice,
          quantity: quantity || 1,
        });

        actionType = "added";
      }

      return updatedCart;
    });

    setTimeout(() => {
      if (actionType === "added") {
        toast.success("🛒 Item added to cart!");
      } else if (actionType === "updated") {
        toast.info("🛒 Quantity updated in cart!");
      }
    }, 0);
  };

  // REMOVE ITEM
  const removeFromCart = (index) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
    toast.info("🗑️ Item removed from cart!");
  };

  const clearCart = () => {
  setCart([]);
  localStorage.removeItem("cart");
};


  // UPDATE QUANTITY
  const updateQuantity = (index, newQty) => {
    if (newQty < 1) return;

    setCart((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, quantity: newQty } : item,
      ),
    );
  };

  // TOTAL CALCULATION
  const subtotal = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );

  const discount = 0;
  const total = subtotal - discount;

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        subtotal,
        discount,
        total,
        totalItems,
        clearCart,
      }}
    >
      {children}

      <ToastContainer position="top-right" autoClose={2500} />
    </CartContext.Provider>
  );
};
