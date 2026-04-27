"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import Image from "next/image";

const ShopPage = () => {
  const [products, setProducts] = useState([]);
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get(
          "https://uniqbd-nextjs-updateversion-backend.onrender.com/api/v1/product"
        );

        setProducts(data.products || []);
      } catch (error) {
        console.log("Product load error:", error);
        setProducts([]);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const { data } = await axios.get(
          "https://uniqbd-nextjs-updateversion-backend.onrender.com/api/v1/product/featured/list"
        );

        setFeatured(data.products || []);
      } catch (error) {
        console.log("Featured load error:", error);
        setFeatured([]);
      }
    };

    fetchFeatured();
  }, []);

  return (
    <div className="min-h-screen px-6 py-12 bg-background">
      <h1 className="text-center text-3xl font-bold text-text mb-12">
        Select Your Products
      </h1>

      <div className="mx-5 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">

        {featured.map((product) => (
          <Link
            key={product._id}
            href={`/products/${product.slug || product.name}`}
            className="bg-button/5 border border-button/10 rounded-xl p-1 shadow-md 
                       hover:shadow-xl hover:-translate-y-1 transition duration-300 cursor-pointer flex flex-col items-center"
          >
            {/* IMAGE OPTIMIZED */}
            <div className="mb-3 flex items-center justify-center w-full">
              <Image
                src={`https://uniqbd-nextjs-updateversion-backend.onrender.com/uploads/${product.photo}`}
                alt={product.name}
                width={800}
                height={0}
                unoptimized
                className="object-contain"
              />
            </div>

            <h2 className="text-sm font-semibold text-center text-button">
              {product.name}
            </h2>

            <div className="mt-2 text-center">
              {product.packageType?.length > 0 && (
                <p className="text-sm font-medium text-text/80">
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
          </Link>
        ))}

      </div>
    </div>
  );
};

export default ShopPage;