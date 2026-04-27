"use client";

import Link from "next/link";

const PremiumCard = ({ item }) => {
  return (
    <Link
      href={`/products/${item.slug}`}
      className="group block cursor-pointer relative rounded-xl overflow-hidden
      bg-imgcard backdrop-blur-3xl shadow-inner shadow-button/30 border border-white/10
      hover:shadow-xl transition-all duration-300"
    >
      {/* Image */}
      <div className="h-40 flex items-center justify-center bg-white/5">
        <img
          src={`https://uniqbd-nextjs-updateversion-backend.onrender.com/uploads/${item.photo}`}
          alt={item.name}
          className="h-32 object-contain transition-transform duration-500 
          group-hover:scale-110"
        />
      </div>

      {/* Content */}
      <div className="p-4 bg-imgcard">
        <h3 className="text-sm font-semibold text-text line-clamp-2">
          {item.name}
        </h3>
      </div>

      {/* Button */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 opacity-0 
        group-hover:opacity-100 transition duration-300">

        <span className="px-4 py-2 text-xs font-medium rounded-full
          bg-white text-black shadow-md hover:scale-105 transition">
          View Product
        </span>
      </div>
    </Link>
  );
};

export default PremiumCard;