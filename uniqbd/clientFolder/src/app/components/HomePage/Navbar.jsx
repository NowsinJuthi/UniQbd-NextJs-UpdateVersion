"use client";

import React, { useContext, useEffect, useState, useRef } from "react";
import {
  FiSearch,
  FiShoppingCart,
  FiUser,
  FiX,
  FiMinus,
  FiPlus,
  FiMenu,
} from "react-icons/fi";
import Link from "next/link";
import { ThemeToggle } from "../../theme-toggle";
import { CartContext } from "@/context/CartContext";
import { motion, AnimatePresence } from "framer-motion";
import { MyContext } from "@/context/ThemeContext";
import AccountMenu from "../AccountMenu/AccountMenu";
import { useRouter } from "next/navigation";
import api from "@/utils/api";

const Navbar = () => {
  const { user, isLogin } = useContext(MyContext);
  const router = useRouter();

  const [mobileMenu, setMobileMenu] = useState(false);
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");

  const {
    cart,
    removeFromCart,
    updateQuantity,
    subtotal,
    total,
    totalItems,
  } = useContext(CartContext);

  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const drawerRef = useRef(null);

  // fetch products
  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const { data } = await api.get("/product");
        setProducts(data.products || []);
      } catch (error) {
        console.error(error);
        setProducts([]);
      }
    };
    fetchAllProducts();
  }, []);

  // mounted fix
  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  // outside click cart drawer
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (drawerRef.current && !drawerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const increaseQty = (i) =>
    updateQuantity(i, cart[i].quantity + 1);

  const decreaseQty = (i) => {
    if (cart[i].quantity > 1) updateQuantity(i, cart[i].quantity - 1);
  };

  const removeItem = (i) => removeFromCart(i);

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl shadow-lg shadow-button/30">

      {/* TOP BAR */}
      <div className="grid grid-cols-12 items-center px-3 md:px-6 py-3 md:py-4 md:mx-5">

        {/* Theme */}
        <div className="col-span-1 md:col-span-1 flex items-center">
          <ThemeToggle />
        </div>

        {/* Logo + Mobile Menu */}
        <div className="col-span-7 md:col-span-2 grid grid-cols-7 items-center gap-3 ml-3">
          <button
            className="md:hidden text-3xl col-span-2"
            onClick={() => setMobileMenu(!mobileMenu)}
          >
            {mobileMenu ? <FiX /> : <FiMenu />}
          </button>

          <Link
            href="/"
            className="text-3xl md:text-3xl font-bold text-text text-center col-span-5"
          >
            UniQbd
          </Link>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex col-span-5 justify-center items-center gap-2 font-medium">
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
              className="relative px-3 py-2 text-sm md:text-base text-text rounded-xl transition-all duration-300 hover:scale-110 group"
            >
              {item.name}
              <span className="absolute w-2 h-2 bg-button rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-bounce top-2 left-3" />
              <span className="absolute w-1.5 h-1.5 bg-button rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-bounce top-3 right-4 delay-100" />
              <span className="absolute w-1 h-1 bg-button rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-bounce bottom-2 left-6 delay-200" />
            </Link>
          ))}
        </div>

        {/* RIGHT ACTIONS */}
        <div className="col-span-4 md:col-span-4 flex justify-end items-center gap-3 md:gap-6">

          {/* Search */}
          <div className="hidden sm:flex items-center bg-imgcard px-3 py-1 rounded-md">
            <FiSearch className="text-text/70 mr-2" />
            <input
              value={search}
              placeholder="Search..."
              onChange={(e) => {
                setSearch(e.target.value);
                router.push(`/search?q=${e.target.value}`);
              }}
              className="bg-transparent outline-none text-xs md:text-sm text-text w-20 md:w-40 focus:w-32 md:focus:w-60 transition-all"
            />
          </div>

          {/* Account */}
          {isLogin ? (
            <AccountMenu />
          ) : (
            <Link href="/dashboard/login">
              <FiUser className="text-3xl md:text-xl hover:text-text transition" />
            </Link>
          )}

          {/* Cart */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="relative text-3xl md:text-xl hover:scale-110 transition"
          >
            <FiShoppingCart />
            {mounted && totalItems > 0 && (

                <span className="absolute -top-2 md:-right-2 -right-1 bg-[#29c093] text-[10px] md:px-1.5 md:py-0 px-2 py-1 rounded-full
                 text-white shadow-md">
                  {cart.length}
                </span>
            )}
              </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {mobileMenu && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden bg-background border-t border-white/10 px-4 py-3 space-y-3"
          >
            <div className="flex items-center bg-imgcard px-3 py-2 rounded-md">
              <FiSearch className="text-text/70 mr-2" />
              <input
                value={search}
                placeholder="Search..."
                onChange={(e) => {
                  setSearch(e.target.value);
                  router.push(`/search?q=${e.target.value}`);
                }}
                className="bg-transparent outline-none text-sm text-text w-full"
              />
            </div>

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
                onClick={() => setMobileMenu(false)}
                className="block py-2 text-text"
              >
                {item.name}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* CART DRAWER */}
      {mounted && (
        <div
          ref={drawerRef}
          className={`fixed top-0 right-0 h-screen z-50 overflow-hidden transition-all duration-500 ease-out
          bg-gradient-to-br from-imgcard/95 via-imgcard/90 to-background/80
          backdrop-blur-2xl border-l border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.4)]
          ${isOpen ? "w-full sm:w-96" : "w-0"}`}
        >

          {/* Header */}
          <div className="flex justify-between items-center px-5 py-4 border-b border-white/10 bg-background/40">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              Cart <span className="text-xs opacity-60">{cart.length}</span>
            </h2>

            <FiX
              onClick={() => setIsOpen(false)}
              className="cursor-pointer hover:rotate-90 transition"
            />
          </div>

          {/* ITEMS */}
          <div className="p-4 space-y-3 overflow-y-auto h-[calc(100%-220px)]">
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center opacity-70 space-y-3">
                <FiShoppingCart className="text-4xl opacity-40" />
                <p>Your cart is empty</p>
                <Link href="/shop">
                  <button
                    onClick={() => setIsOpen(false)}
                    className="px-4 py-2 text-sm bg-button text-white rounded-lg hover:scale-105 transition"
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
                    className="flex items-center gap-4 p-4 rounded-2xl bg-package/40 border border-white/10"
                  >
                    <img
                      src={item.img}
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

                    <div className="text-right">
                      <p>{item.price * item.quantity} TK</p>
                      <button onClick={() => removeItem(i)} className="text-xs opacity-70">
                        Remove
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>

          {/* FOOTER */}
          <div className="absolute bottom-0 w-full p-4 border-t border-white/10 bg-imgcard/80">
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