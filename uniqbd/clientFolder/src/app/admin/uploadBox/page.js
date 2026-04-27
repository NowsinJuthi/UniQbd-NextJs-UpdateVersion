"use client";

import { useState, useContext } from "react";
import { FaRegImage } from "react-icons/fa";
import { MyContext } from "@/context/ThemeContext";
import { uploadImage } from "@/utils/api";

const UploadBox = ({ onChange, multiple = false, url, name = "images", className = "" }) => {
  const [uploading, setUploading] = useState(false);
  const context = useContext(MyContext);

  const onChangeFile = async (e) => {
    try {
      if (!url) return console.error("Upload URL missing");

      const files = e.target.files;
      if (!files || files.length === 0) return;

      const formData = new FormData();
      setUploading(true);

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!["image/jpeg", "image/png", "image/webp", "image/svg+xml"].includes(file.type)) {
          context?.alertBox("error", "Only JPG, PNG, WEBP or SVG allowed");
          setUploading(false);
          return;
        }
        formData.append(name, file);
      }

      const res = await uploadImage(url, formData);
      setUploading(false);

      if (res.success) {
        onChange?.(res.images);
      } else {
        console.error(res.message || "Upload failed");
      }
    } catch (error) {
      console.error(error);
      setUploading(false);
    }
  };

  return (
    <div className={`relative w-[150px] h-[120px] rounded-md bg-gray-100 p-5 border flex flex-col items-center justify-center ${className}`}>
      <FaRegImage size={40} className="text-gray-400 mb-2" />
      <span className="text-gray-600 text-[13px]">{uploading ? "Uploading..." : "Image Upload"}</span>
      <input
        type="file"
        multiple={multiple}
        accept="image/*"
        onChange={onChangeFile}
        className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
      />
    </div>
  );
};

export default UploadBox;