"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import api, { appUrl } from "@/utils/api";

const Topup = () => {
  const [topupProducts, setTopupProducts] = useState([]);

  useEffect(() => {
    const fetchTopupProducts = async () => {
      try {
        const { data: categoryData } = await api.get(`/category`);

        const topupCategory = categoryData.categories.find(
          (cat) => cat.name.toLowerCase() === "top-up"
        );

        if (!topupCategory) {
          setTopupProducts([]);
          return;
        }

        const { data: productsRes } = await api.get(
          `/product?category=${topupCategory._id}`
        );
        console.log("TOPUP CATEGORY:", topupCategory);
        console.log("PRODUCT RESPONSE:", productsRes);
        console.log("PRODUCTS:", productsRes.products);

        setTopupProducts(productsRes.products || []);
      } catch (error) {
        console.error(error);
        setTopupProducts([]);
      }
    };

    fetchTopupProducts();
  }, []);

  const featuredProduct = topupProducts.find((p) => p.featured);
  const normalProducts = topupProducts.filter((p) => !p.featured);
  console.log("TOPUP PRODUCTS:", topupProducts);

  if (topupProducts.length > 0) {
    console.log("FIRST PRODUCT:", topupProducts[0]);
  }
  return (
    <section className="relative py-6 sm:py-8 md:py-12 lg:py-16 px-3 sm:px-4 md:px-6 lg:px-8 overflow-hidden">
      {/* HEADER */}
      <div className="text-center mb-6 md:mb-14 relative z-10">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-text tracking-wide">
          Game Top Up
        </h1>

        <p className="text-gray-400 mt-2 md:mt-3 text-xs sm:text-sm md:text-base px-2">
          Fast & secure game recharge services
        </p>
      </div>

      {/* MAIN LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6 relative z-10">
        {/* FEATURED PRODUCT */}
        <div className="lg:col-span-4 order-1 lg:order-2">
          {featuredProduct ? (

            <Link
              href={`/${featuredProduct.category?.slug}/${featuredProduct.slug}`}
              className="
                lg:sticky lg:top-24
                group block h-fit
                overflow-hidden rounded-2xl md:rounded-3xl
                border border-cyan-400/20
                bg-gradient-to-b from-cyan-500/10 to-transparent
                backdrop-blur-2xl
                shadow-2xl shadow-cyan-500/10
                transition-all duration-300
                hover:-translate-y-2
                hover:shadow-cyan-500/30
              "
            >
              <div className="relative p-4 sm:p-5 md:p-6 flex items-center justify-center">
                <Image
                  src={`${appUrl}/uploads/${featuredProduct.photo}`}
                  alt={featuredProduct.name}
                  width={800}
                  height={600}
                  unoptimized
                  className="
                    w-full
                    max-w-[260px]
                    sm:max-w-[320px]
                    md:max-w-full
                    h-auto
                    object-contain
                    transition-transform
                    duration-500
                    group-hover:scale-110
                    drop-shadow-2xl
                  "
                />
              </div>

              <div className="px-4 md:px-6 pb-5 md:pb-6 text-center">
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-text">
                  {featuredProduct.name}
                </h2>
              </div>

              <div className="absolute bottom-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
            </Link>
          ) : (
            <div className="text-center py-16 md:py-20 text-text/60">
              No featured product
            </div>
          )}
        </div>

        {/* PRODUCTS GRID */}
        <div className="lg:col-span-8 order-2 lg:order-1">
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
            {normalProducts.length === 0 && (
              <div className="col-span-full text-center py-16 md:py-20 text-text/60">
                No products available
              </div>
            )}

            {normalProducts.map((product) => (
              <Link
                key={product._id}
                href={`/${product.category.slug}/${product.slug}`}
                className="
                  group block h-fit
                  overflow-hidden rounded-2xl md:rounded-3xl
                  border border-cyan-400/20
                  bg-gradient-to-b from-cyan-500/10 to-transparent
                  backdrop-blur-2xl
                  shadow-2xl shadow-cyan-500/10
                  transition-all duration-300
                  hover:-translate-y-2
                  hover:shadow-cyan-500/30
                "
              >
                <div className="relative flex items-center justify-center p-3 sm:p-4 md:p-5">
                  <Image
                    src={`${appUrl}/uploads/${product.photo}`}
                    alt={product.name}
                    width={800}
                    height={600}
                    unoptimized
                    className="
                      w-full
                      max-w-[260px]
                      sm:max-w-[320px]
                      md:max-w-full
                      h-auto
                      object-contain
                      transition-transform
                      duration-500
                      group-hover:scale-110
                      drop-shadow-2xl
                    "
                  />
                </div>

                <div className="px-2 sm:px-3 md:px-4 pb-3 sm:pb-4 md:pb-5 text-center">
                  <h2 className="text-xs sm:text-sm md:text-base font-semibold text-text line-clamp-2 leading-snug">
                    {product.name}
                  </h2>
                </div>

                <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Topup;