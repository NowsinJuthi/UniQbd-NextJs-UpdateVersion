"use client";
import React from "react";

const Choose = () => {
  const items = [
    { title: "Instant Delivery", desc: "Receive your top-up instantly" },
    { title: "Secure Payment", desc: "bKash, Nagad & Rocket supported" },
    { title: "Trusted Store", desc: "Thousands of gamers trust us" },
    { title: "24/7 Support", desc: "Always ready to help" },
  ];

  return (
    <div>
      <section className="relative py-20 overflow-hidden">

        {/* ORIGINAL GLOW (UNCHANGED) */}
        <div className="absolute w-96 h-96 bg-button/20 blur-[120px] top-10 left-20"></div>
        <div className="absolute w-96 h-96 bg-button/30 blur-[120px] bottom-10 right-20"></div>

        {/* TITLE (UNCHANGED) */}
        <h2 className="text-3xl font-bold text-center mb-14 relative z-10 animate-fadeIn">
          Why Choose UniQbd
        </h2>

        {/* GRID (UNCHANGED) */}
        <div className="grid md:grid-cols-4 gap-10 px-6 md:px-10 max-w-7xl mx-auto relative z-10">

          {items.map((item, i) => (
            <div
              key={i}
              className="group backdrop-blur-lg bg-button/5 rounded-2xl p-8 shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-2"
            >
              {/* ICON */}
              <div className="text-4xl mb-2 group-hover:animate-bounce transition">
                ✨
              </div>

              <h3 className="font-semibold mt-4 text-lg text-text">
                {item.title}
              </h3>

              <p className="text-sm mt-2 text-gray-700">
                {item.desc}
              </p>

              {/* glow line */}
              <div className="h-[2px] w-0 group-hover:w-full transition-all duration-500 bg-button mt-4"></div>
            </div>
          ))}

        </div>
      </section>
    </div>
  );
};

export default Choose;