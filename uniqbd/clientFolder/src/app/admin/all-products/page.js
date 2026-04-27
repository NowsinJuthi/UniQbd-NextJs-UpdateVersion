"use client";

import React, { useState } from "react";
import Link from "next/link";
import axios from "axios";
import useSWR from "swr";
import { useRouter } from "next/navigation";
import AdminMenuPage from "../Menu/page";
import Image from "next/image";

// -------------------- FETCHER --------------------
const fetcher = (url) =>
  axios.get(url, { withCredentials: true }).then((res) => res.data);

// -------------------- COMPONENT --------------------
const AllProductpage = () => {
  const router = useRouter();

  // pagination state
  const [page, setPage] = useState(1);
  const limit = 12;

  // -------------------- SWR DATA FETCH --------------------
  const { data, isLoading, mutate } = useSWR(
    `http://localhost:3001/api/v1/product?includeUnpublished=true&page=${page}&limit=${limit}`,
    fetcher,
  );

  const products = data?.products || [];

  // -------------------- ACTIONS --------------------

  const toggleFeatured = async (id) => {
    try {
      const { data } = await axios.patch(
        `http://localhost:3001/api/v1/product/featured/${id}`,
        {},
        { withCredentials: true },
      );

      mutate(); // refresh cache
    } catch (error) {
      console.log("Featured toggle error:", error);
    }
  };

  const togglePublish = async (id) => {
    try {
      await axios.patch(
        `http://localhost:3001/api/v1/product/publish/${id}`,
        {},
        { withCredentials: true },
      );

      mutate();
    } catch (error) {
      console.log("Publish toggle error:", error);
    }
  };

  const deleteProduct = async (id) => {
    try {
      const confirmDelete = window.confirm("Are you sure?");
      if (!confirmDelete) return;

      await axios.delete(`http://localhost:3001/api/v1/product/${id}`, {
        withCredentials: true,
      });

      mutate();
    } catch (error) {
      console.log(error.response?.data || error.message);
    }
  };

  // -------------------- LOADING UI --------------------
  if (isLoading) {
    return (
      <div className="p-6 text-center text-gray-400">Loading products...</div>
    );
  }

  // -------------------- UI --------------------
  return (
    <div className="grid grid-cols-12 gap-6 p-6 min-h-screen bg-black/5">
      {/* SIDEBAR */}
      <aside className="md:col-span-3 p-6 border-r bg-button/5 rounded-2xl">
        <AdminMenuPage />
      </aside>

      {/* MAIN */}
      <main className="col-span-12 md:col-span-9 space-y-6">
        {/* HEADER */}
        <div className="bg-button/5 p-6 rounded-2xl flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">All Products</h1>
            <p className="text-gray-400 text-sm">
              Manage your products efficiently
            </p>
          </div>

          <div className="text-sm text-center">
            <p>Total: {products.length}</p>
          </div>
        </div>

        {/* PRODUCTS GRID */}
        <div className="bg-button/5 p-6 rounded-2xl">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {products.map((product) => {
              const isPublished = product.isPublished ?? true;

              // price calculation
              let displayPrice = product.price;

              if (product.packageType?.length > 0) {
                const lowest = product.packageType.reduce((min, pkg) =>
                  (pkg.discountPrice || pkg.price) <
                  (min.discountPrice || min.price)
                    ? pkg
                    : min,
                );

                displayPrice = lowest.discountPrice || lowest.price;
              }

              return (
                <div
                  key={product._id}
                  className="bg-white/5 rounded-2xl p-4 flex flex-col hover:scale-[1.03] transition"
                >
                  {/* PRODUCT IMAGE */}
                  <Link href={`/products/${product.slug}`}>
                    <div className="w-full flex items-center justify-center">
                      <Image
                        src={`http://localhost:3001/uploads/${product.photo}`}
                        alt={product.name}
                        width={200}
                        height={200}
                        className="object-contain"
                        unoptimized
                      />
                    </div>

                    {/* PRODUCT INFO */}
                    <h2 className="text-sm font-semibold text-center mt-2 truncate">
                      {product.name}
                    </h2>

                  </Link>

                  {/* STATUS */}
                  <div className="mt-2 text-center">
                    <span
                      className={`text-[10px] px-2 py-1 rounded-full ${
                        isPublished
                          ? "bg-green-500/10 text-green-400"
                          : "bg-red-500/10 text-red-400"
                      }`}
                    >
                      {isPublished ? "Published" : "Unpublished"}
                    </span>
                  </div>

                  {/* ACTIONS */}
                  <div className="flex flex-col gap-2 mt-4">
                    <button
                      onClick={() => togglePublish(product._id)}
                      className="text-xs py-2 rounded-xl bg-yellow-500/10 text-yellow-400"
                    >
                      Toggle Publish
                    </button>

                    <button
                      onClick={() => toggleFeatured(product._id)}
                      className="text-xs py-2 rounded-xl bg-blue-500/10 text-blue-400"
                    >
                      Toggle Featured
                    </button>

                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          router.push(`/admin/products?editId=${product.slug}`)
                        }
                        className="flex-1 text-xs py-2 rounded-xl bg-gray-500/10"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => deleteProduct(product._id)}
                        className="flex-1 text-xs py-2 rounded-xl bg-red-500/10 text-red-400"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* PAGINATION */}
          <div className="flex justify-center gap-4 mt-6">
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="px-4 py-2 bg-gray-700 rounded disabled:opacity-50"
            >
              Prev
            </button>

            <span className="text-sm text-gray-400">Page {page}</span>

            <button
              onClick={() => setPage(page + 1)}
              className="px-4 py-2 bg-gray-700 rounded"
            >
              Next
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AllProductpage;
