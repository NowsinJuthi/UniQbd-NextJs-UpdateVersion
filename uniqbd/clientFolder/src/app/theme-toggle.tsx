"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { FaMoon, FaSun } from "react-icons/fa";

export function ThemeToggle() {
  const [theme, setTheme] = useState("light");

  // Apply theme class to <html>
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

  return (
    <Button
      variant="outline"
      size="icon"
      className="rounded-full relative p-2 overflow-hidden"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
    >
      {/* Sun icon */}
      <FaSun
        className={`absolute h-5 w-5 transition-all duration-300 
          ${theme === "light" ? "rotate-0 scale-100" : "-rotate-90 scale-0"}`}
      />
      {/* Moon icon */}
      <FaMoon
        className={`absolute h-5 w-5 transition-all duration-300 
          ${theme === "dark" ? "rotate-0 scale-100" : "rotate-90 scale-0"}`}
      />
    </Button>
  );
}