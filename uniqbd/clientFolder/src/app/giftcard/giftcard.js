"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import axios from "axios";

const GiftCard = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        const { data: categoryData } = await axios.get(
          "https://uniqbd-nextjs-updateversion-backend.onrender.com/api/v1/category"
        );

        const category = categoryData.categories.find(
          (cat) => cat.name.toLowerCase() === "gift-card"
        );

        if (!category) {
          setProducts([]);
          setLoading(false);
          return;
        }

        const { data: productsRes } = await axios.get(
          `https://uniqbd-nextjs-updateversion-backend.onrender.com/api/v1/product?category=${category._id}`
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
              href={`/products/${product.slug}`}
              className="
                bg-imgcard backdrop-blur-3xl shadow-inner shadow-button/30 text-sm font-medium text-text 
                float-card group relative rounded-2xl overflow-hidden
                border border-white/10
                transition-all duration-300 ease-out hover:shadow-2xl
                w-full flex flex-col
              "
            >

              {/* IMAGE */}
              <div className="flex items-center justify-center p-4">
                <img
                  src={`https://uniqbd-nextjs-updateversion-backend.onrender.com/uploads/${product.photo}`}
                  alt={product.name}
                  className="max-h-full object-contain group-hover:scale-110 transition duration-300"
                />
              </div>

              {/* TEXT */}
              <div className="px-3 pb-4 text-center relative z-10">
                <h2 className="text-sm font-semibold line-clamp-2">
                  {product.name}
                </h2>

                {product.packageType?.length > 0 && (
                  <p className="mt-2 text-sm font-medium text-text/80">
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

              {/* BOTTOM LINE */}
              <div className="absolute bottom-0 left-0 w-full h-[2px] bg-white/10 group-hover:bg-white/20 transition" />
            </Link>
          ))}
      </div>
    </section>
  );
};

export default GiftCard;