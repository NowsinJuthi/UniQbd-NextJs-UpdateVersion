"use client"

import React, { useState, useEffect } from "react";
import { IoCloseOutline } from "react-icons/io5";
import { FaWhatsapp, FaFacebookMessenger } from "react-icons/fa";
import { MdOutlineCall } from "react-icons/md";
import { TbMessageCircleQuestion } from "react-icons/tb";

const Socialicones = () => {
  const [openIcones, setOpenIcones] = useState(false);

  useEffect(() => {
    if (openIcones) {
      const timer = setTimeout(() => {
        setOpenIcones(false);
      }, 20000);
      return () => clearTimeout(timer);
    }
  }, [openIcones]);

  return (
    <div className="fixed bottom-10 right-6 z-[9999] animate-bounce">
      {/* Icons */}
      <div
        className={`absolute bottom-16 right-0 flex flex-col items-end space-y-4 transition-all duration-500 ${
          openIcones ? "opacity-100 scale-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"
        }`}
      >
        {/* WhatsApp */}
        <a
          href="https://wa.me/yourwhatsapplink"
          target="_blank"
          rel="noreferrer"
          className="group"
        >
          <FaWhatsapp
            className={`h-12 w-12 p-2 text-white rounded-full shadow-lg bg-gradient-to-tr from-green-600 via-green-500 to-green-400 transition-transform duration-500 transform group-hover:scale-110 ${
              openIcones ? "translate-y-0 rotate-0" : "translate-y-20 rotate-180"
            }`}
          />
        </a>

        {/* Messenger */}
        <a
          href="https://m.me/yourmessengerid"
          target="_blank"
          rel="noreferrer"
          className="group"
        >
          <FaFacebookMessenger
            className={`h-12 w-12 p-2 text-white rounded-full shadow-lg bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 transition-transform duration-500 transform group-hover:scale-110 ${
              openIcones ? "translate-y-0 rotate-0" : "translate-y-16 rotate-180"
            }`}
          />
        </a>

        {/* Phone */}
        <a href="tel:+8801xxxxxxxxx" className="group">
          <MdOutlineCall
            className={`h-12 w-12 p-2 text-white rounded-full shadow-lg bg-gradient-to-tr from-teal-600 via-green-500 to-lime-400 transition-transform duration-500 transform group-hover:scale-110 ${
              openIcones ? "translate-y-0 rotate-0" : "translate-y-10 rotate-180"
            }`}
          />
        </a>
      </div>

      {/* Toggle Button */}
      <div
        onClick={() => setOpenIcones((prev) => !prev)}
        className="relative flex items-center justify-center cursor-pointer"
      >
        {openIcones ? (
          <span className="relative flex h-14 w-14">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <IoCloseOutline
              className={`relative h-14 w-14 bg-gradient-to-tr from-blue-500 via-sky-400 to-blue-300 text-white rounded-full shadow-lg z-20 transition-transform duration-500 ${
                openIcones ? "rotate-180" : "rotate-0"
              }`}
            />
          </span>
        ) : (
          <span className="relative flex h-14 w-14">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <TbMessageCircleQuestion
              className={`relative h-14 w-14 bg-gradient-to-tr from-blue-500 via-sky-400 to-blue-300 text-white p-2 rounded-full shadow-lg z-20 transition-transform duration-500 ${
                openIcones ? "rotate-180" : "rotate-0"
              }`}
            />
          </span>
        )}
      </div>
    </div>
  );
};

export default Socialicones;
