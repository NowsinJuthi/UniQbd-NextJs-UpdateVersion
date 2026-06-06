"use client";

import React, { useContext, useEffect, useState } from "react";
import Link from "next/link";
import { CartContext } from "@/context/CartContext";

const Cart = () => {


  const { cart, removeFromCart, updateQuantity, subtotal } = useContext(CartContext);

  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const changeQuantity = (index, delta) => {
    const newQty = cart[index].quantity + delta;
    updateQuantity(index, newQty);
  };

  const removeItem = (index) => {
    removeFromCart(index);
  };


  if (!hasMounted) return null;

  return (
    <div className="min-h-screen bg-cover bg-center py-16 px-4">
      <div className="max-w-6xl mx-auto bg-imgcard backdrop-blur-md rounded-2xl shadow-inner shadow-button/30 p-8">
        <h1 className="text-3xl font-bold mb-10 text-text">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT SIDE */}
          <div className="lg:col-span-2 space-y-6">
            <div className="hidden md:grid grid-cols-5 text-text font-semibold border-b border-button pb-4">
              <span className="col-span-2">Product</span>
              <span>Price</span>
              <span>Quantity</span>
              <span>Subtotal</span>
            </div>

            {cart.length === 0 && <p className="text-text">Your cart is empty.</p>}

            {cart.map((product, index) => (
              <div
                key={index}
                className="grid grid-cols-1 md:grid-cols-5 items-center gap-2 bg-button/10 rounded-xl p-5 shadow-inner shadow-button/30"
              >
                {/* Product Info */}
                
                  <img
                    src={product.img}
                    alt={product.name}
                    className="w-20 h-20 rounded-lg object-cover border border-button/20"
                  />
                  <div>
                    <h2 className="font-semibold text-text">{product.name}</h2>
                    <p className="text-sm text-gray-400">{product.package}</p>
                     <p className="text-sm text-gray-400">Player ID: {product.playerId}</p>
                    <button
                      onClick={() => removeItem(index)}
                      className="text-red-400 text-xs mt-1 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                

                {/* Price */}
                <div className="text-text font-medium">{product.price} TK</div>

                {/* Quantity */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => changeQuantity(index, -1)}
                    className="w-8 h-8 flex items-center justify-center bg-button text-white rounded-md hover:bg-button/40 transition"
                  >
                    −
                  </button>
                  <span className="text-text font-semibold">{product.quantity}</span>
                  <button
                    onClick={() => changeQuantity(index, 1)}
                    className="w-8 h-8 flex items-center justify-center bg-button text-white rounded-md hover:bg-button/40 transition"
                  >
                    +
                  </button>
                </div>

                {/* Subtotal */}
                <div className="font-semibold text-text">{product.price * product.quantity} TK</div>
              </div>
            ))}
          </div>

          {/* RIGHT SIDE */}
          <div className="bg-button/5 p-6 rounded-2xl shadow-inner shadow-button/30 h-fit">
            <h2 className="text-2xl font-bold mb-6 text-text">Cart Totals</h2>
            <div className="flex justify-between mb-4 text-text">
              <span>Subtotal</span>
              <span>{subtotal} TK</span>
            </div>
            <div className="border-t border-button/40 pt-4 flex justify-between font-semibold text-lg text-text">
              <span>Total</span>
              <span>{subtotal} TK</span>
            </div>
            <Link href="/checkout">
              <button className="mt-6 w-full bg-button text-white py-3 rounded-xl hover:scale-105 transition shadow-lg shadow-button/40">
                Proceed To Checkout
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;