"use client";

import { useEffect } from "react";

const VisionProEnvironment = () => {
  useEffect(() => {
    const root = document.getElementById("vision-env-root");


    const createBubble = () => {
      const el = document.createElement("div");

      const size = Math.random() * 60 + 10;
      const left = Math.random() * 100;

      el.className =
        "absolute bottom-0 rounded-full bg-white/10 border border-white/20 backdrop-blur-md shadow-[0_0_25px_rgba(0,255,255,0.15)] animate-float";

      el.style.width = `${size}px`;
      el.style.height = `${size}px`;
      el.style.left = `${left}%`;
      el.style.animationDuration = `${10 + Math.random() * 10}s`;
      el.style.opacity = `${0.1 + Math.random() * 0.3}`;

      root.appendChild(el);

      setTimeout(() => el.remove(), 20000);
    };

    const interval = setInterval(createBubble, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div id="vision-env-root" className="fixed inset-0 overflow-hidden pointer-events-none z-0">

      {/* 🌫 Ambient Fog */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(0,255,255,0.15),transparent_40%),radial-gradient(circle_at_80%_80%,rgba(147,51,234,0.15),transparent_50%)] opacity-70" />

      {/* ✨ Light Beam Layer */}
      <div className="absolute inset-0">
        <div className="absolute w-[200%] h-[200%] rotate-12 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-slow-scan" />
      </div>

      {/* 🧊 Glass Noise Overlay */}
      <div className="absolute inset-0 opacity-[0.04] mix-blend-overlay bg-[url('/noise.png')]" />
    </div>
  );
};

export default VisionProEnvironment;