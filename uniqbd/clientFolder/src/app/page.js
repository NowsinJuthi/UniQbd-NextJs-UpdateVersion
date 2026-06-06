"use client";

import React, { useEffect } from "react";
import Topup from "./components/HomePage/GameTopUp/Topup";
import GiftCard from "./components/HomePage/GiftCard/GiftCard";
import Choose from "./components/HomePage/Choose/choose";
import HomeSliderDisplay from "./components/HomePage/Slider";


function Page() {
 

  return (
    <div className="relative overflow-hidden min-h-screen">
      {/* Background Image */}
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-50"></div>

      {/* Optional Dark Overlay */}
      <div className="absolute inset-0"></div>

      {/* Page Content */}
      <div className="relative z-10">
    
        <HomeSliderDisplay />
        <Topup />
        <GiftCard />
        <Choose />
      </div>
    </div>
  );
}

export default Page;
