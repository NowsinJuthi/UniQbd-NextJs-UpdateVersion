"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import axios from "axios";

import api, { appUrl } from "@/utils/api";


const Topup = () => {
  const [topupProducts, setTopupProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopupProducts = async () => {
      try {
        setLoading(true);

        const { data: categoryData } = await api.get(
          `/category`
        );

        const topupCategory = categoryData.categories.find(
          (cat) => cat.name.toLowerCase() === "top-up"
        );

        if (!topupCategory) {
          setTopupProducts([]);
          setLoading(false);
          return;
        }

        const { data: productsRes } = await api.get(
          `/product?category=${topupCategory._id}`
        );

        setTopupProducts(productsRes.products || []);
      } catch (error) {
        console.error(error);
        setTopupProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTopupProducts();
  }, []);

  return (
    <section className="relative py-16 px-4 md:px-10 overflow-hidden">

      {/* Background Glow (UNCHANGED)
      <div className="absolute top-10 left-10 w-72 h-72 bg-cyan-500/10 blur-3xl rounded-full animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-purple-500/10 blur-3xl rounded-full animate-pulse"></div> */}

      {/* HEADER (UNCHANGED) */}
      <div className="text-center mb-14">
        <h1 className="text-4xl md:text-5xl font-bold text-text tracking-wide">
          Game Top Up
        </h1>
        <p className="text-gray-400 mt-3 text-sm md:text-base">
          Fast & secure game recharge services
        </p>
      </div>

      {/* GRID (UNCHANGED) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">

        {/* LOADING */}
        {loading &&
          Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-56 rounded-2xl bg-white/10 animate-pulse"
            />
          ))}

        {/* EMPTY */}
        {!loading && topupProducts.length === 0 && (
          <div className="col-span-full text-center text-gray-400 py-16">
            No top-up products available right now.
          </div>
        )}

        {/* PRODUCTS */}
        {!loading &&
          topupProducts.map((product) => (
            <Link
              key={product._id}
             href={`/${product.category.slug}/${product.slug}`}
              className="
    sticky top-24 group block
              overflow-hidden rounded-3xl
              border border-cyan-400/20
              bg-gradient-to-b from-cyan-500/10 to-transparent
              backdrop-blur-2xl
              shadow-2xl shadow-cyan-500/10
              transition-all duration-300

              hover:-translate-y-2
              hover:shadow-cyan-500/30
  "
              style={{ perspective: "1000px" }}
            >
              {/* ICON / IMAGE AREA */}
              <div className="
      relative flex items-center justify-center p-5
      transition-transform duration-300
      group-hover:scale-110
      group-hover:translate-z-10
    "
              >
                <div className="
        absolute inset-0 rounded-full blur-2xl
        bg-cyan-500/10 opacity-0 group-hover:opacity-100
        transition
      "
                />

                <img
                 src={`${appUrl}/uploads/${product.photo || product.packageImage}`}
                  alt={product.name}
                  className="
         object-contain
        drop-shadow-lg
        transition-transform duration-300
      "
                />
              </div>

              {/* TEXT */}
              <div className="px-3 pb-4 text-center relative z-10">
                <h2 className="text-sm font-semibold text-text line-clamp-2">
                  {product.name}
                </h2>

                {product.packageType?.length > 0 && (
                  <p className="mt-2 text-xs text-gray-300">
                    {product.packageType.length === 1
                      ? `${product.packageType[0]?.price} TK`
                      : `${product.packageType[0]?.price} TK - ${product.packageType[product.packageType.length - 1]?.price
                      } TK`}
                  </p>
                )}
              </div>

              {/* bottom glow line */}
              <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
            </Link>
          ))}
      </div>
    </section>
  );
};

export default Topup;