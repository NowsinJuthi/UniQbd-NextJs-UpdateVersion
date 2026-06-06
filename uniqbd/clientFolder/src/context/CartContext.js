"use client";

import React, { createContext, useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { appUrl } from "@/utils/api";

export const CartContext = createContext();

function parsePrice(value) {
  return Number(
    String(value ?? 0)
      .replace("TK", "")
      .replace(/,/g, "")
      .trim(),
  );
}

function getProductId(product) {
  return product?.id ?? product?._id;
}

function getCategoryName(category) {
  if (!category) return "";
  if (typeof category === "string") return category;
  return category.name || category.slug || "";
}

function isTopUpProduct(product) {
  return getCategoryName(product?.category).toLowerCase() === "top-up";
}

function getPackageLabel(selectedPkg) {
  if (!selectedPkg) return "";
  return selectedPkg.name || selectedPkg.uc || "";
}

function getItemPrice(selectedPkg, product) {
  if (selectedPkg) {
    const raw =
      selectedPkg.discountPrice ?? selectedPkg.discount ?? selectedPkg.price;
    return parsePrice(raw);
  }

  const raw = product?.discountPrice ?? product?.price;
  return parsePrice(raw);
}

function loadCartFromStorage() {
  if (typeof window === "undefined") return [];

  try {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  } catch {
    return [];
  }
}

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(loadCartFromStorage);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = ({ product, selectedPkg, playerId, quantity }) => {
    const packages = product?.packageType || product?.packages || [];

    if (packages.length > 0 && !selectedPkg) {
      toast.error("⚠️ Please select a package first!");
      return false;
    }

    if (isTopUpProduct(product) && (!playerId || playerId.trim() === "")) {
      toast.error("⚠️ Please enter your Player ID!");
      return false;
    }

    const productId = getProductId(product);
    const packageLabel = getPackageLabel(selectedPkg);
    const itemPrice = getItemPrice(selectedPkg, product);
    const qty = quantity || 1;

    if (!itemPrice) {
      toast.error("⚠️ Product price is unavailable!");
      return false;
    }

    let actionType = null;

    setCart((prev) => {
      const existsIndex = prev.findIndex(
        (item) =>
          item.id === productId &&
          item.package === packageLabel &&
          item.playerId === (playerId || ""),
      );

      if (existsIndex > -1) {
        actionType = "updated";
        return prev.map((item, i) =>
          i === existsIndex
            ? { ...item, quantity: item.quantity + qty }
            : item,
        );
      }

      actionType = "added";
      return [
        ...prev,
        {
          id: productId,
          name: product.name,
          img: product.photo
            ? `${appUrl}/uploads/${product.photo}`
            : "/placeholder.png",
          package: packageLabel,
          playerId: playerId || "",
          price: itemPrice,
          quantity: qty,
        },
      ];
    });

    if (actionType === "added") {
      toast.success("🛒 Item added to cart!");
    } else if (actionType === "updated") {
      toast.info("🛒 Quantity updated in cart!");
    }

    return true;
  };

  const removeFromCart = (index) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
    toast.info("🗑️ Item removed from cart!");
  };

  const clearCart = () => {
    setCart([]);
  };

  const updateQuantity = (index, newQty) => {
    if (newQty < 1) return;

    setCart((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, quantity: newQty } : item,
      ),
    );
  };

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
