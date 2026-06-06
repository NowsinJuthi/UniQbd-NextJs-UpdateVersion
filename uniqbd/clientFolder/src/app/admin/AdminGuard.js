"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/utils/api";

export default function AdminGuard({ children }) {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await api.get("/admin"); // protected route test
      } catch (err) {
        router.push("/dashboard/login");
      }
    };

    checkAuth();
  }, []);

  return children;
}