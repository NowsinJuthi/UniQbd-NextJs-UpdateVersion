"use client";

import React, { useState } from "react";
import Link from "next/link";
import axios from "axios";
import useSWR from "swr";
import { useRouter } from "next/navigation";
import AdminMenuPage from "../Menu/page";
import Image from "next/image";
import api, { fetchDataFromApi, appUrl } from "@/utils/api";

const fetcher = (url) => fetchDataFromApi(url);

const AllProductpage = () => {
  const router = useRouter();

  const [page, setPage] = useState(1);
  const limit = 12;

  const { data, isLoading, mutate } = useSWR(
    `/admin/products?page=${page}&limit=${limit}`,
    fetcher
  );

  const products = data?.products || [];
  if (products.length > 0) {
    console.log("PHOTO:", products[0].photo);
    console.log("PACKAGE:", products[0].packageImage);
  }



  const togglePublish = async (id) => {
    try {
      await api.patch(`/product/publish/${id}`, {}, {
        withCredentials: true,
      });

      mutate();
    } catch (error) {
      console.log(error);
    }
  };

  const toggleFeatured = async (id) => {
    try {
      await api.patch(`/product/featured/${id}`, {}, {
        withCredentials: true,
      });

      mutate();
    } catch (error) {
      console.log(error);
    }
  };

  const deleteProduct = async (id) => {
    try {
      if (!confirm("Are you sure?")) return;

      await api.delete(`/product/${id}`, {
        withCredentials: true,
      });

      mutate();
    } catch (error) {
      console.log(error);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 text-center text-white">
        Loading products...
      </div>
    );
  }

  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6 p-3 md:p-6 min-h-screen bg-black/5">

      {/* SIDEBAR */}
      <aside className="col-span-12 md:col-span-3 p-3 md:p-6 border-r bg-button/5 rounded-2xl">
        <AdminMenuPage />
      </aside>

      {/* MAIN */}
      <main className="col-span-12 md:col-span-9 space-y-4 md:space-y-6">

        {/* HEADER */}
        <div className="bg-button/5 p-4 md:p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">
              All Products
            </h1>
            <p className="text-gray-400 text-sm">
              Manage your products
            </p>
          </div>

          <div className="text-sm">
            Total: {products.length}
          </div>
        </div>

        {/* GRID */}
        <div className="bg-button/5 p-3 md:p-6 rounded-2xl">

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-6">

            {products.map((product) => (
              <div
                key={product._id}
                className="bg-white/5 p-3 md:p-4 rounded-2xl flex flex-col"
              >

                <Link  href={`/${product.category.slug}/${product.slug}`}>
                  <div className="w-full flex justify-center">
                    <Image
                      src={`${appUrl}/uploads/${product.photo || product.packageImage}`}
                      alt={product.name}
                      width={200}
                      height={200}
                      unoptimized
                      className="w-full h-auto object-contain"
                    />
                  </div>

                  <h2 className="text-xs md:text-sm text-center mt-2 truncate">
                    {product.name}
                  </h2>
                </Link>

                {/* ACTIONS */}
                <div className="flex flex-col gap-2 mt-3 md:mt-4">

                  <button
                    onClick={() => togglePublish(product._id)}
                    className={`text-[10px] md:text-xs py-2 rounded ${product.isPublished
                      ? "bg-green-500/10 text-green-400"
                      : "bg-yellow-500/10 text-yellow-400"
                      }`}
                  >
                    {product.isPublished ? "Published" : "Not Published"}
                  </button>

                  <button
                    onClick={() => toggleFeatured(product._id)}
                    className={`text-[10px] md:text-xs py-2 rounded ${product.featured
                      ? "bg-blue-500/10 text-blue-400"
                      : "bg-gray-500/10 text-gray-400"
                      }`}
                  >
                    {product.featured ? "Featured" : "Not Featured"}
                  </button>

                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        router.push(`/admin/products?editId=${product._id}`)
                      }
                      className="flex-1 text-[10px] md:text-xs bg-gray-500/10 py-2 rounded"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => deleteProduct(product._id)}
                      className="flex-1 text-[10px] md:text-xs bg-red-500/10 text-red-400 py-2 rounded"
                    >
                      Delete
                    </button>
                  </div>

                </div>
              </div>
            ))}

          </div>

          {/* PAGINATION */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-3 mt-6">

            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="px-4 py-2 bg-gray-700 rounded disabled:opacity-50 w-full sm:w-auto"
            >
              Prev
            </button>

            <span className="text-sm">Page {page}</span>

            <button
              onClick={() => setPage(page + 1)}
              className="px-4 py-2 bg-gray-700 rounded w-full sm:w-auto"
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