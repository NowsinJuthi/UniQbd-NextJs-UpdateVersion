"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import api, { appUrl } from "@/utils/api";

const GiftCard = () => {
  const [giftProducts, setGiftProducts] = useState([]);

  useEffect(() => {
    const fetchGiftProducts = async () => {
      try {
        const { data: categoryData } = await api.get(`/category`);

        const giftCategory = categoryData.categories.find(
          (cat) => cat.name.toLowerCase() === "gift-card"
        );

        if (!giftCategory) {
          setGiftProducts([]);
          return;
        }

        const { data: productsRes } = await api.get(
          `/product?category=${giftCategory._id}`
        );

        setGiftProducts(productsRes.products || []);
      } catch (error) {
        console.error(error);
        setGiftProducts([]);
      }
    };

    fetchGiftProducts();
  }, []);


  const sortedProducts = [
    ...giftProducts.filter((p) => p.featured),
    ...giftProducts.filter((p) => !p.featured),
  ];

  return (
    <section className="relative md:py-16 py-7 px-4 md:px-8 overflow-hidden">

    
      {/* HEADER */}
      <div className="text-center md:mb-14 mb-7 relative z-10">
        <h1 className="text-2xl md:text-5xl font-bold text-text tracking-wide">
          Gift Cards
        </h1>

        <p className="text-gray-400 mt-3 text-sm md:text-base">
          Buy your favorite digital gift cards instantly
        </p>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5 relative z-10">

        {sortedProducts.length === 0 && (
          <div className="col-span-full text-center py-20 text-text/60">
            No gift card products available.
          </div>
        )}

        {sortedProducts.map((product, index) => (
          <Link
            key={product._id}
            href={`/${product.category.slug}/${product.slug}`}
            className={`
            "
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

            ${product.featured && index === 0
                ? "col-span-2 row-span-2"
                : ""
              }
          `}
          >
            {/* Glow Effect */}
            <div className="absolute inset-0 bg-cyan-500/5 opacity-0 group-hover:opacity-100 blur-3xl transition duration-300" />

            {/* FEATURED BADGE */}
            {/* {product.featured && (
              <div className="absolute top-3 left-3 z-20">
                <span className="bg-cyan-500 text-white text-[10px] md:text-xs px-3 py-1 rounded-full font-semibold shadow-lg">
                  FEATURED
                </span>
              </div>
            )} */}

            {/* IMAGE */}
            <div
              className={`
              relative flex items-center justify-center w-full
              ${product.featured && index === 0
                  ? "p-8 min-h-[260px]"
                  : "p-5 min-h-[140px]"
                }
            `}
            >
              <Image
                src={`${appUrl}/uploads/${product.photo || product.packageImage}`}
                alt={product.name}
                width={800}
                height={400}
                unoptimized
                className="
                object-contain
                transition-transform duration-300
                group-hover:scale-110
                drop-shadow-2xl
              "
              />
            </div>

            {/* TEXT */}
            <div
              className={`
              text-center relative z-10
              ${product.featured && index === 0
                  ? "px-6 pb-8"
                  : "px-4 pb-5"
                }
            `}
            >
              <h2
                className={`
                font-semibold text-text line-clamp-2
                ${product.featured && index === 0
                    ? "text-xl md:text-2xl"
                    : "text-sm md:text-base"
                  }
              `}
              >
                {product.name}
              </h2>

              {/* <p
                className={`
                mt-2
                ${product.featured && index === 0
                    ? "text-cyan-300 text-sm"
                    : "text-gray-300 text-xs"
                  }
              `}
              >
                {product.featured ? "Featured Product" : "Digital Gift Card"}
              </p> */}
            </div>

            {/* Bottom Glow */}
            <div className="absolute bottom-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
          </Link>
        ))}
      </div>
    </section>
  );
};

export default GiftCard;