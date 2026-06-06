"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import axios from "axios";

import api, { appUrl } from "@/utils/api";

const GiftCard = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        const { data: categoryData } = await api.get(
          `/category`
        );

        const category = categoryData.categories.find(
          (cat) => cat.name.toLowerCase() === "gift-card"
        );

        if (!category) {
          setProducts([]);
          setLoading(false);
          return;
        }

        const { data: productsRes } = await api.get(
          `/product?category=${category._id}`
        );

        setProducts(productsRes.products || []);
      } catch (error) {
        console.error(error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <section className="py-16 px-4 md:px-10 h-full text-text">

      {/* HEADER (UNCHANGED) */}
      <div className="text-center mb-14">
        <h1 className="text-4xl md:text-5xl font-bold tracking-wide">
          Gift Cards
        </h1>
        <p className="text-gray-400 mt-3 text-sm md:text-base">
          Choose your favorite digital gift cards instantly
        </p>
      </div>

      {/* GRID (UNCHANGED) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 text-text">

        {/* LOADING */}
        {loading &&
          Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-44 rounded-2xl bg-white/10 animate-pulse"
            />
          ))}

        {/* EMPTY */}
        {!loading && products.length === 0 && (
          <div className="col-span-full text-center text-gray-400 py-16">
            No gift cards available right now.
          </div>
        )}

      
        {/* PRODUCTS */}
        {!loading &&
          products.map((product) => (
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
              {/* IMAGE AREA */}
              <div
                className="
          relative flex items-center justify-center p-5
          transition-transform duration-300
          group-hover:scale-110
        "
              >
                {/* Glow */}
                <div
                  className="
            absolute inset-0 rounded-full blur-2xl
            bg-cyan-500/10 opacity-0
            group-hover:opacity-100
            transition duration-300
          "
                />

                <img
                  src={`${appUrl}/uploads/${product.photo}`}
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
                      : `${product.packageType[0]?.price} TK - ${product.packageType[
                        product.packageType.length - 1
                      ]?.price
                      } TK`}
                  </p>
                )}
              </div>

              {/* Bottom Glow Line */}
              <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
            </Link>
          ))}
      </div>
    </section>
  );
};

export default GiftCard;