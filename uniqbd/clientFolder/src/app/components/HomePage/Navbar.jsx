"use client";

import React, { useContext, useEffect, useState, useRef } from "react";
import {
  FiSearch,
  FiShoppingCart,
  FiUser,
  FiX,
  FiMinus,
  FiPlus,
} from "react-icons/fi";
import Link from "next/link";
import { ThemeToggle } from "../../theme-toggle";
import { CartContext } from "@/context/CartContext";
import { motion, AnimatePresence } from "framer-motion";
import { MyContext } from "@/context/ThemeContext";
import AccountMenu from "../AccountMenu/AccountMenu";
import { useRouter } from "next/navigation";
import axios from "axios";

const Navbar = () => {
  const { user, isLogin } = useContext(MyContext);
  const router = useRouter();

  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const { data } = await axios.get(
          "https://uniqbd-nextjs-updateversion-backend.onrender.com/api/v1/product"
        );
        setProducts(data.products || []);
      } catch (error) {
        console.error(error);
        setProducts([]);
      }
    };
    fetchAllProducts();
  }, []);

  const {
    cart,
    removeFromCart,
    updateQuantity,
    subtotal,
    discount,
    total,
    totalItems,
  } = useContext(CartContext);

  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const drawerRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (drawerRef.current && !drawerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const increaseQty = (index) =>
    updateQuantity(index, cart[index].quantity + 1);

  const decreaseQty = (index) => {
    if (cart[index].quantity > 1)
      updateQuantity(index, cart[index].quantity - 1);
  };

  const removeItem = (index) => removeFromCart(index);

  return (
    <nav className="sticky top-0 z-50 shadow-lg shadow-button/30 bg-background/80 backdrop-blur-xl">
      <div className="mx-3 md:mx-5 px-3 md:px-6 py-3 md:py-4 grid grid-cols-12 items-center">

        {/* Theme Toggle */}
        <div className="col-span-2 md:col-span-1">
          <ThemeToggle />
        </div>

        {/* Logo */}
        <div className="col-span-6 md:col-span-2">
          <Link href="/" className="text-xl md:text-3xl font-bold text-text">
            UniQbd
          </Link>
        </div>

        {/* Menu (Desktop only) */}
        <div className="col-span-5 hidden md:flex justify-center items-center gap-2 font-medium">
          {[
            { name: "Home", link: "/" },
            { name: "Shop", link: "/shop" },
            { name: "Game TopUp", link: "/topup" },
            { name: "Gift Card", link: "/giftcard" },
            { name: "Contact", link: "/contact" },
          ].map((item) => (
            <Link
              key={item.name}
              href={item.link}
              className="relative px-3 py-2 text-sm md:text-base rounded-xl text-text transition-all duration-300 hover:scale-110 group overflow-hidden"
            >
              {item.name}
              <span className="absolute w-2 h-2 bg-button rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-bounce top-2 left-3"></span>
              <span className="absolute w-1.5 h-1.5 bg-button rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-bounce top-3 right-4 delay-100"></span>
              <span className="absolute w-1 h-1 bg-button rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-bounce bottom-2 left-6 delay-200"></span>
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div className="col-span-4 md:col-span-4 flex items-center justify-end gap-3 md:gap-6">

          {/* Search */}
          <div className="hidden sm:flex items-center bg-imgcard px-2 md:px-3 py-1 rounded-md">
            <FiSearch className="text-text/70 mr-1 md:mr-2" />
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                router.push(`/search?q=${e.target.value}`);
              }}
              className="bg-transparent outline-none text-xs md:text-sm text-text w-20 md:w-40 focus:w-32 md:focus:w-60 transition-all duration-300"
            />
          </div>

          {/* Account */}
          {isLogin ? (
            <Link href={user?.role === "ADMIN" ? "/admin" : "/my-account"}>
              <AccountMenu />
            </Link>
          ) : (
            <Link href="/dashboard/login">
              <FiUser className="text-lg md:text-xl cursor-pointer hover:text-text transition" />
            </Link>
          )}

          {/* Cart */}
          <button
            onClick={() => setIsOpen((prev) => !prev)}
            className="relative text-lg md:text-xl hover:scale-110 transition"
          >
            <FiShoppingCart />
            {mounted && totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-button text-[10px] md:text-xs px-1.5 rounded-full text-white shadow-md shadow-button/40">
                {cart.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Cart Drawer */}
      {mounted && (
        <div
          ref={drawerRef}
          className={`fixed top-0 right-0 h-screen
          bg-gradient-to-br from-imgcard/95 via-imgcard/90 to-background/80
          backdrop-blur-2xl border-l border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.4)]
          z-50 transition-all duration-500 ease-out overflow-hidden
          ${isOpen ? "w-full sm:w-96" : "w-0"}`}
        >

          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-background/40 backdrop-blur-xl">
            <h2 className="text-lg font-semibold tracking-wide flex items-center gap-2">
              Cart <span className="ml-2 text-xs opacity-60">{cart.length}</span>
            </h2>
            <FiX
              onClick={() => setIsOpen(false)}
              className="text-xl cursor-pointer hover:rotate-90 transition-transform duration-300"
            />
          </div>

          {/* Items */}
          <div className="p-4 space-y-3 overflow-y-auto h-[calc(100%-220px)] scrollbar-thin scrollbar-thumb-button/40 scrollbar-track-transparent">
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center opacity-70 space-y-3">
                <FiShoppingCart className="text-4xl opacity-40" />
                <p className="text-gray-300">Your cart is empty</p>
                <Link href="/shop">
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-sm px-4 py-2 rounded-lg bg-button text-white hover:scale-105 transition-transform duration-300"
                  >
                    Browse Products
                  </button>
                </Link>
              </div>
            ) : (
              <AnimatePresence>
                {cart.map((item, i) => (
                  <motion.div
                    key={i}
                    className="flex items-center gap-4 p-4 rounded-2xl bg-package/40 backdrop-blur-xl border border-white/10"
                  >
                    <img
                      src={item.img}
                      alt={item.name}
                      className="w-14 h-14 rounded-lg object-cover"
                    />

                    <div className="flex-1">
                      <p className="text-sm font-semibold">{item.name}</p>
                      <p className="text-xs opacity-60">{item.package}</p>

                      <div className="flex items-center gap-2 mt-1">
                        <button onClick={() => decreaseQty(i)}>
                          <FiMinus />
                        </button>
                        <span>{item.quantity}</span>
                        <button onClick={() => increaseQty(i)}>
                          <FiPlus />
                        </button>
                      </div>
                    </div>

                    <div>
                      <p>{item.price * item.quantity} TK</p>
                      <button onClick={() => removeItem(i)}>Remove</button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>

          {/* Footer */}
          <div className="absolute bottom-0 w-full p-4 border-t border-white/10 bg-imgcard/80 backdrop-blur-xl">
            <div className="flex justify-between text-sm">
              <span>Subtotal</span>
              <span>{subtotal} TK</span>
            </div>

            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>{total} TK</span>
            </div>

            <Link href="/cart">
              <button className="w-full bg-button text-white py-2 rounded-lg mt-2">
                Go to Cart
              </button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;