"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const SearchPage = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        const { data } = await axios.get(
          "https://uniqbd-nextjs-updateversion-backend.onrender.com/api/v1/product"
        );

        setProducts(data.products || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-white mb-6">
        Search Results: "{query}"
      </h1>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">

        {loading && (
          <p className="text-white col-span-full text-center">
            Loading...
          </p>
        )}

        {!loading && filteredProducts.length === 0 && (
          <p className="col-span-full text-center text-text/60">
            No products found.
          </p>
        )}

        {filteredProducts.map((product) => (
          <Link
            key={product._id}
            href={`/products/${product.slug}`}
            className="bg-imgcard backdrop-blur-3xl transition-all duration-300 cursor-pointer
            flex flex-col items-center justify-center px-4 py-4 rounded-xl text-sm font-medium text-text 
            hover:shadow-2xl hover:-translate-y-2 border-button shadow-inner shadow-button/30"
          >
            <img
              src={`https://uniqbd-nextjs-updateversion-backend.onrender.com/uploads/${product.photo}`}
              alt={product.name}
              className="object-contain mb-2"
            />
            <h2 className="text-sm font-semibold text-center">
              {product.name}
            </h2>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SearchPage;