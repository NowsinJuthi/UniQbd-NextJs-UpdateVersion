"use client";

import React, { useEffect, useState, useRef } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Image from "next/image";
import api from "@/utils/api";

const HomeSliderDisplay = () => {
  const sliderRef = useRef(null);
  const [sliderImages, setSliderImages] = useState([]);

  const settings = {
    dots: true,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    arrows: false,
    pauseOnHover: true,
    fade: true,
  };

  // 🔥 FIXED: use axios instance (NOT fetch)
  useEffect(() => {
    const fetchSlider = async () => {
      try {
        const res = await api.get("/home-slider/images");

        if (res.data?.success) {
          setSliderImages(res.data.data || []);
        }
      } catch (error) {
        console.log("Slider fetch error:", error);
      }
    };

    fetchSlider();
  }, []);

  return (
    <div className="relative w-full px-4 md:px-8 lg:px-8 mt-8">
      <Slider ref={sliderRef} {...settings}>
        {sliderImages.map((src, index) => (
          <div key={index} className="relative">

            <Image
              className="w-full rounded-3xl shadow-2xl h-[320px] md:h-[440px] lg:h-[560px] object-cover"
              src={`${process.env.NEXT_PUBLIC_API_URL}${src}`}
              alt={`slider${index + 1}`}
              width={1200}
              height={600}
              priority={index === 0}
              unoptimized
            />

            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/30 to-transparent rounded-3xl"></div>
            <div className="absolute bottom-0 left-0 w-full h-44 bg-gradient-to-b from-transparent via-black/30 to-black rounded-b-3xl"></div>

          </div>
        ))}
      </Slider>
    </div>
  );
};

export default HomeSliderDisplay;