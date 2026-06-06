"use client";

import { useEffect, useRef } from "react";

export default function SnakeBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let points = [];
    let mouse = { x: canvas.width / 2, y: canvas.height / 2 };

    const move = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;

      points.push({ x: mouse.x, y: mouse.y });

      if (points.length > 80) points.shift();
    };

    window.addEventListener("mousemove", move);

    function draw() {
      ctx.fillStyle = "rgba(0,0,0,0.08)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < points.length; i++) {
        const p = points[i];
        const size = (i / points.length) * 30;

        ctx.beginPath();
        ctx.fillStyle = `rgba(0, 255, 255, ${i / points.length})`;
        ctx.shadowBlur = 25;
        ctx.shadowColor = "#00ffff";
        ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
        ctx.fill();
      }

      requestAnimationFrame(draw);
    }

    draw();

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-0"
    />
  );
}