"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import BubbleBackground from "../../BubbleBackground";

const Topup = () => {
  const [topupProducts, setTopupProducts] = useState([]);

  useEffect(() => {
    const fetchTopupProducts = async () => {
      try {
        const { data: categoryData } = await axios.get(
          "http://localhost:3001/api/v1/category"
        );

        const topupCategory = categoryData.categories.find(
          (cat) => cat.name.toLowerCase() === "top-up"
        );

        if (!topupCategory) {
          setTopupProducts([]);
          return;
        }

        const { data: productsRes } = await axios.get(
          `http://localhost:3001/api/v1/product?category=${topupCategory._id}`
        );

        setTopupProducts(productsRes.products || []);
      } catch (error) {
        console.error("Error fetching top-up products:", error);
        setTopupProducts([]);
      }
    };

    fetchTopupProducts();
  }, []);

  return (
    <section className="py-14 px-6">
      <div>
        {/* SECTION TITLE (UNCHANGED) */}
        <h1 className="text-4xl font-bold text-button text-center mb-10">
          <span className="relative px-5 py-2 rounded-xl font-medium text-text transition-all duration-300 hover:scale-105 overflow-hidden">
            Game Top Up
            <span className="absolute inset-0 rounded-xl bg-button/15 blur-md transition duration-300"></span>
            <span className="absolute w-2 h-2 bg-button rounded-full animate-bounce top-2 left-3"></span>
            <span className="absolute w-1.5 h-1.5 bg-button rounded-full animate-bounce top-3 right-4 delay-100"></span>
            <span className="absolute w-1 h-1 bg-button rounded-full animate-bounce bottom-2 left-6 delay-200"></span>
          </span>
        </h1>

        {/* GRID (UNCHANGED) */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {topupProducts.length === 0 && (
            <p className="text-center col-span-full text-text/60">
              No top-up products available.
            </p>
          )}

          {topupProducts.map((product, index) => (
            <Link
              key={product._id}
              href={`/products/${product.slug}`}
              className={`group relative overflow-hidden transition-all duration-300 cursor-pointer
              flex flex-col items-center justify-center px-4 py-6 text-sm font-medium text-text
              bg-white/10 backdrop-blur-2xl
              rounded-[1rem] 
              border border-white/5
              shadow-[inset_0_4px_8px_rgba(255,255,255,0.6)]
              hover:shadow-2xl hover:-translate-y-2 
              ${index === 4 ? "col-span-2 row-span-2" : ""}`}
            >
              {/* INNER GLOW (UNCHANGED) */}
              <div className="absolute bg-radial-[at_3%_1%] from-[#9bddf5] to-[#c9effa] to-30% -top-1 left-0 w-full inset-[3.03px] rounded-t-[1rem] border-t-[3px] overflow-hidden border-white/10 pointer-events-none"></div>

              {/* IMAGE OPTIMIZED */}
              <Image
                src={`http://localhost:3001/uploads/${product.photo}`}
                alt={product.name}
                width={800}
                height={120}
                
                        unoptimized
                className="object-contain mb-4 drop-shadow-lg group-hover:scale-110 transition-transform"
              />

              <h2 className="text-base font-bold text-center tracking-tight">
                {product.name}
              </h2>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Topup;