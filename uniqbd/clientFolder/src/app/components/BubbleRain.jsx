"use client";
import { useEffect, useState } from "react";

const BubbleRain = () => {
  const [bubbles, setBubbles] = useState([]);

  useEffect(() => {
    const generated = Array.from({ length: 35 }).map(() => ({
      left: Math.random() * 100,
      duration: 15 + Math.random() * 25, // 15s - 40s
      size: 10 + Math.random() * 30,
      delay: Math.random() * 10,
    }));

    setBubbles(generated);
  }, []);

  return (
    <div className="bubble-rain">
      {bubbles.map((b, i) => (
        <span
          key={i}
          style={{
            left: `${b.left}%`,
            width: `${b.size}px`,
            height: `${b.size}px`,
            animationDuration: `${b.duration}s`,
            animationDelay: `${b.delay}s`,
          }}
        />
      ))}
    </div>
  );
};

export default BubbleRain;