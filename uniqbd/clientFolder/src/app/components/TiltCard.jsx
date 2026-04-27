"use client";

import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { FaWhatsapp, FaFacebookF } from "react-icons/fa";
import { toast } from "react-toastify";

const TiltCard = () => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const slug = params.slug;

  const cardRef = useRef(null);
  const imgRef = useRef(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:3001/api/v1/product/${slug}`
        );
        setProduct(data.product);
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  if (loading) {
    return (
      <div className="text-center mt-20 text-xl font-semibold">
        Loading...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center mt-20 text-2xl font-bold">
        Product Not Found
      </div>
    );
  }

  // Discount calculation
  const packages = product.packageType || [];

  const maxDiscountPercent = packages.length
    ? Math.max(
        ...packages.map((p) =>
          p.discountPrice
            ? Math.round(((p.price - p.discountPrice) / p.price) * 100)
            : 0
        )
      )
    : 0;

  // Share logic
  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/products/${slug}`
      : "";

  const shareText = `Check out this product on UniQbd: ${product.name}`;

  const whatsappShare = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(
      shareText + " " + shareUrl
    )}`;
    window.open(url, "_blank");
  };

  const facebookShare = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      shareUrl
    )}`;
    window.open(url, "_blank");
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Link copied!");
    } catch (err) {
      toast.error("Failed to copy link");
    }
  };

  // Tilt effect
  const applyTilt = (clientX, clientY) => {
    const card = cardRef.current;
    const img = imgRef.current;

    const rect = card.getBoundingClientRect();

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * 10;
    const rotateY = ((x - centerX) / centerX) * -10;

    card.style.transition = "transform 0.05s ease-out";
    img.style.transition = "transform 0.05s ease-out";

    card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
    img.style.transform = `translateX(${rotateY * 4}px) translateY(${rotateX * 4}px) translateZ(40px)`;
  };

  const resetTilt = () => {
    const card = cardRef.current;
    const img = imgRef.current;

    card.style.transition = "transform 0.3s ease-out";
    img.style.transition = "transform 0.3s ease-out";

    card.style.transform = "rotateX(0deg) rotateY(0deg) scale(1)";
    img.style.transform = "translateX(0px) translateY(0px) translateZ(0px)";
  };

  return (
    <div className="group perspective-[1000px] w-full flex justify-center items-center mt-10 md:mt-20">
      <div
        ref={cardRef}
        onMouseMove={(e) => applyTilt(e.clientX, e.clientY)}
        onMouseLeave={resetTilt}
        onTouchMove={(e) =>
          applyTilt(e.touches[0].clientX, e.touches[0].clientY)
        }
        onTouchEnd={resetTilt}
        className="relative bg-imgcard backdrop-blur-3xl cursor-pointer
        flex flex-col items-center justify-center px-4 py-4 rounded-xl text-sm font-medium text-button
        hover:shadow-2xl border-button shadow-inner shadow-button/30 transform-gpu will-change-transform
        h-[260px] sm:h-[320px] md:h-[400px] lg:h-full"
      >
        {/* Glow */}
        <div className="absolute bg-button/30 blur-3xl opacity-40 top-[-20px] left-[-20px] rounded-full"></div>
        <div className="absolute bg-button/20 blur-3xl opacity-30 bottom-[-20px] right-[-20px] rounded-full"></div>

        {/* Discount */}
        {maxDiscountPercent > 0 && (
          <span className="absolute bg-amber-300 top-3 right-3 z-30 text-xs font-bold px-3 py-4.5 rounded-full shadow-lg">
            -{maxDiscountPercent}%
          </span>
        )}

        {/* Share Buttons */}
        <div className="absolute bottom-3 right-3 flex gap-2 z-30">
          <button
            onClick={whatsappShare}
            className="bg-green-500 text-white p-2 rounded-full shadow hover:scale-110 transition"
            title="Share on WhatsApp"
          >
            <FaWhatsapp />
          </button>

          <button
            onClick={facebookShare}
            className="bg-blue-600 text-white p-2 rounded-full shadow hover:scale-110 transition"
            title="Share on Facebook"
          >
            <FaFacebookF />
          </button>

          <button
            onClick={copyLink}
            className="bg-gray-700 text-white p-2 rounded-full shadow hover:scale-110 transition text-xs"
            title="Copy Link"
          >
            🔗
          </button>
        </div>

        {/* Image */}
        <img
          ref={imgRef}
          src={`http://localhost:3001/uploads/${product.photo}`}
          alt={product.name}
          className="object-contain z-10"
          style={{ transformStyle: "preserve-3d" }}
        />

        {/* Name */}
        <h3 className="mt-4 text-text font-semibold text-center z-20">
          {product.name}
        </h3>
      </div>
    </div>
  );
};

export default TiltCard;