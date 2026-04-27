"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import UploadBox from "../uploadBox/page";
import { RxCrossCircled } from "react-icons/rx";
import AdminMenuPage from "../Menu/page";

const HomeSlider = () => {
  const [images, setImages] = useState([]);


  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await axios.get(
          "http://localhost:3001/api/v1/home-slider/images",
          { withCredentials: true }
        );

        if (res.data.success) {
          setImages(res.data.data); // ['/uploads/a.jpg', ...]
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchImages();
  }, []);


  const handleFilesChange = (uploadedImages = []) => {
    if (!Array.isArray(uploadedImages)) uploadedImages = [uploadedImages];

    setImages((prev) => [
      ...prev,
      ...uploadedImages.filter((img) => !prev.includes(img)),
    ]);
  };


  const removeImage = async (index) => {
  const imgPath = images[index];

  try {
    await axios.delete("http://localhost:3001/api/v1/home-slider", {
      data: { path: imgPath },
      withCredentials: true,
    });

    setImages((prev) => prev.filter((_, i) => i !== index));
  } catch (err) {
    console.error(err.response?.data || err.message);
  }
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white">

      {/* HEADER */}
      <div className="px-6 py-4 border-b border-white/10 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Home Slider</h1>
        <span className="text-sm text-white/60">Admin Panel</span>
      </div>

      <div className="grid grid-cols-12 gap-6 p-6">

        {/* SIDEBAR */}
        <div className="col-span-12 md:col-span-3">
          <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-lg border border-white/10 shadow-xl">
            <h2 className="text-xl font-bold mb-6 text-center">
              Admin Panel
            </h2>
            <AdminMenuPage />
          </div>
        </div>

        {/* MAIN */}
        <div className="col-span-12 md:col-span-9 space-y-6">

          {/* TITLE */}
          <div className="p-5 rounded-2xl bg-white/5 backdrop-blur-lg border border-white/10 shadow-lg">
            <h2 className="text-xl font-semibold">
              Manage Slider Images
            </h2>
            <p className="text-sm text-white/60 mt-1">
              Upload, preview and remove homepage slider images
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* UPLOAD */}
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
              <h3 className="text-lg font-semibold mb-4">
                Upload Images
              </h3>

              <UploadBox
                url="http://localhost:3001/api/v1/home-slider"
                name="images"
                multiple
                onChange={handleFilesChange}
              />
            </div>

            {/* PREVIEW */}
            <div className="lg:col-span-2 p-6 rounded-2xl bg-white/5 border border-white/10">

              <div className="flex justify-between mb-4">
                <h3 className="text-lg font-semibold">
                  Uploaded Images
                </h3>
                <span className="text-sm text-white/60">
                  {images.length} items
                </span>
              </div>

              {images.length === 0 ? (
                <p className="text-white/50 text-sm">
                  No images uploaded yet
                </p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-h-[420px] overflow-y-auto pr-2">

                  {images
                    .filter((img) => img)
                    .map((img, index) => (
                      <div
                        key={index}
                        className="relative group rounded-xl overflow-hidden border border-white/10 shadow"
                      >

                        {/* IMAGE */}
                        <img
                          src={`http://localhost:3001${img}`}
                          className="w-full h-36 object-cover group-hover:scale-110 transition"
                          onError={(e) => {
                            e.target.style.display = "none";
                          }}
                        />

                        {/* FILENAME */}
                        <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-xs p-1 text-center">
                          {img.split("/").pop()}
                        </div>

                        {/* DELETE */}
                        <button
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 bg-white/90 p-1 rounded-full hover:bg-red-100"
                        >
                          <RxCrossCircled size={20} className="text-red-500" />
                        </button>

                      </div>
                    ))}
                </div>
              )}

            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default HomeSlider;