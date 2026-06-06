"use client";

import React, { useState, useEffect } from "react";
import UploadBox from "../uploadBox/page";
import { RxCrossCircled } from "react-icons/rx";
import AdminMenuPage from "../Menu/page";
import api from "@/utils/api";

const HomeSlider = () => {
  const [images, setImages] = useState([]);

  // ================= FETCH =================
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await api.get("/home-slider/images");

        if (res.data?.success) {
          setImages(res.data.data || []);
        }
      } catch (err) {
        console.error("Fetch error:", err?.message);
      }
    };

    fetchImages();
  }, []);

  // ================= UPLOAD (FIXED) =================
  const handleFilesChange = (uploadedImages = []) => {
    const files = Array.isArray(uploadedImages)
      ? uploadedImages
      : [uploadedImages];


    const clean = files.filter(Boolean);

    setImages((prev) => [...prev, ...clean]);
  };

  // ================= DELETE =================
  const removeImage = async (index) => {
    const imgPath = images[index];

    try {
      await api.delete("/home-slider", {
        data: { path: imgPath },
      });

      setImages((prev) => prev.filter((_, i) => i !== index));
    } catch (err) {
      console.error("Delete error:", err?.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white">

      <div className="px-6 py-4 border-b border-white/10 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Home Slider</h1>
        <span className="text-sm text-white/60">Admin Panel</span>
      </div>

      <div className="grid grid-cols-12 gap-6 p-6">

        <div className="col-span-12 md:col-span-3">
          <AdminMenuPage />
        </div>

        <div className="col-span-12 md:col-span-9 space-y-6">

          <UploadBox
            url="/home-slider"
            name="images"
            multiple
            onChange={handleFilesChange}
          />

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">

            {images.map((img, index) => (
              <div key={index} className="relative">

                <img
                  src={`${process.env.NEXT_PUBLIC_API_URL}${img}`}
                  className="w-full h-32 object-cover rounded"
                  alt="slider"
                />

                <button
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2"
                >
                  <RxCrossCircled className="text-red-500" />
                </button>

              </div>
            ))}

          </div>

        </div>
      </div>
    </div>
  );
};

export default HomeSlider;