"use client";

import React, { useState } from "react";
import { FaFacebookF, FaInstagram, FaYoutube } from "react-icons/fa";
import { FaPlus, FaMinus } from "react-icons/fa6";

const Footer = () => {
  const [open, setOpen] = useState(null);

  const toggle = (index) => {
    setOpen(open === index ? null : index);
  };

  const isOpen = (index) => open === index;

  return (
    <footer className="pt-14 pb-8 px-6 bg-button/5 backdrop-blur-md shadow-2xl shadow-button/30">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

        {/* Address (always open) */}
        <div>
          <h2 className="text-5xl text-text font-bold mb-4">UniQbd</h2>
          <p className="text-sm text-text leading-6">
            Razabari, Turag, Dhaka 1711<br />
            Email: support@uniqbd.com <br />
            Phone: +880 1XXXXXXXXX
          </p>
        </div>

        {/* Store */}
        <div>
          <button
            onClick={() => toggle(1)}
            className="md:cursor-default flex justify-between w-full md:block"
          >
            <h2 className="text-lg text-text font-semibold mb-4">Our Store</h2>
            <span className="md:hidden text-text">
              {isOpen(1) ? <FaMinus /> : <FaPlus />}
            </span>
          </button>

          <ul className={`space-y-2 text-sm text-text md:block ${isOpen(1) ? "block" : "hidden"} md:!block`}>
            <li className="hover:text-white cursor-pointer transition">Game Top Up</li>
            <li className="hover:text-white cursor-pointer transition">Gift Cards</li>
            <li className="hover:text-white cursor-pointer transition">Software</li>
            <li className="hover:text-white cursor-pointer transition">Offers</li>
          </ul>
        </div>

        {/* Links */}
        <div>
          <button
            onClick={() => toggle(2)}
            className="md:cursor-default flex justify-between w-full md:block"
          >
            <h2 className="text-lg text-text font-semibold mb-4">Useful Links</h2>
            <span className="md:hidden text-text">
              {isOpen(2) ? <FaMinus /> : <FaPlus />}
            </span>
          </button>

          <ul className={`space-y-2 text-sm text-text md:block ${isOpen(2) ? "block" : "hidden"} md:!block`}>
            <li className="hover:text-white cursor-pointer transition">About Us</li>
            <li className="hover:text-white cursor-pointer transition">Contact</li>
            <li className="hover:text-white cursor-pointer transition">Privacy Policy</li>
            <li className="hover:text-white cursor-pointer transition">Terms & Conditions</li>
          </ul>
        </div>

        {/* Social */}
        <div>
          <button
            onClick={() => toggle(3)}
            className="md:cursor-default flex justify-between w-full md:block"
          >
            <h2 className="text-lg text-text font-semibold mb-4">Follow Us</h2>
            <span className="md:hidden text-text">
              {isOpen(3) ? <FaMinus /> : <FaPlus />}
            </span>
          </button>

          <div className={`flex gap-4 text-text md:flex ${isOpen(3) ? "flex" : "hidden"} md:!flex`}>
            <div className="bg-button text-white p-3 rounded-full hover:bg-blue-600 transition cursor-pointer">
              <FaFacebookF />
            </div>
            <div className="bg-button text-white p-3 rounded-full hover:bg-pink-600 transition cursor-pointer">
              <FaInstagram />
            </div>
            <div className="bg-button text-white p-3 rounded-full hover:bg-red-600 transition cursor-pointer">
              <FaYoutube />
            </div>
          </div>
        </div>

      </div>

      {/* Bottom */}
      <div className="border-t border-gray-800 mt-10 pt-6 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} UniQbd. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;