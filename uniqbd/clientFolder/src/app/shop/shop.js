"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

import api, { appUrl } from "@/utils/api";

const ShopPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        const { data } = await api.get(`/product`);
        setProducts(data.products || []);
      } catch (error) {
        console.log("Product load error:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <section className="py-16 px-4 md:px-10 h-full text-text">

      {/* HEADER (same as GiftCard) */}
      <div className="text-center mb-14">
        <h1 className="text-4xl md:text-5xl font-bold tracking-wide">
          Shop Products
        </h1>
        <p className="text-gray-400 mt-3 text-sm md:text-base">
          Choose your favorite digital products instantly
        </p>
      </div>

      {/* GRID (EXACT SAME STRUCTURE) */}
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
            No products available right now.
          </div>
        )}

        {/* PRODUCTS (SAME CARD STYLE AS GIFT CARD) */}
        {!loading &&
          products.map((product) => (
            <Link
              key={product._id}
              href={`/${product.category.slug}/${product.slug}`}
              className="
                group block
                overflow-hidden rounded-3xl
                border border-cyan-400/20
                bg-gradient-to-b from-cyan-500/10 to-transparent
                backdrop-blur-2xl
                shadow-2xl shadow-cyan-500/10
                transition-all duration-300

                hover:-translate-y-2
                hover:shadow-cyan-500/30
              "
            >
              {/* IMAGE AREA */}
              <div className="
                relative flex items-center justify-center p-5
                transition-transform duration-300
                group-hover:scale-110
              ">
                {/* Glow */}
                <div className="
                  absolute inset-0 rounded-full blur-2xl
                  bg-cyan-500/10 opacity-0
                  group-hover:opacity-100
                  transition duration-300
                " />

                <Image
                  src={`${appUrl}/uploads/${product.photo}`}
                  alt={product.name}
                  width={300}
                  height={300}
                  unoptimized
                  className="object-contain drop-shadow-lg"
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
                      : `${product.packageType[0]?.price} TK - ${
                          product.packageType[
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

export default ShopPage;