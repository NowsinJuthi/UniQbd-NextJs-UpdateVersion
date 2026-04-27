"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import CircularProgress from "@mui/material/CircularProgress";
import { toast } from "react-toastify";
import { postData } from "@/utils/api";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

const ChangePasswordpage = () => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: Cookies.get("userEmail"),
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    Cookies.remove("actionType");
  }, []);

  const onChangeHandler = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await postData(
        "/api/v1/forgot-password/change-password",
        formData,
      );
      console.log("FormData being sent:", formData);
      if (!res.error) {
        setLoading(false);
        Cookies.remove("verifyEmail");
        router.push("/dashboard/login");
      } else {
        toast.error(res.message || "Something went wrong");
        setLoading(false);
      }
    } catch (err) {
      toast.error("Server error");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-5">
      <div className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-3xl p-8">
        <h1 className="text-3xl font-bold text-center text-text mb-2">
          Change Password
        </h1>

        <p className="text-gray-400 text-center mb-8">
          Enter your new password
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* new password */}
          <div className="relative">
            <input
              type={showNew ? "text" : "password"}
              name="newPassword"
              required
              value={formData.newPassword}
              onChange={onChangeHandler}
              placeholder="New Password"
              className="peer w-full p-4 rounded-xl bg-box border-b-2 border-button outline-none text-text placeholder-transparent focus:border-button transition"
            />

            <label
              className="absolute left-4 top-4 text-gray-400 text-sm transition-all 
              peer-placeholder-shown:top-4
              peer-placeholder-shown:text-base
              peer-focus:top-1
              peer-focus:text-sm
              peer-focus:text-button"
            >
              New Password
            </label>

            <span
              className="absolute right-4 top-4 text-gray-400 cursor-pointer"
              onClick={() => setShowNew(!showNew)}
            >
              {showNew ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          {/* confirm password */}
          <div className="relative">
            <input
              type={showConfirm ? "text" : "password"}
              name="confirmPassword"
              required
              value={formData.confirmPassword}
              onChange={onChangeHandler}
              placeholder="Confirm Password"
              className="peer w-full p-4 rounded-xl bg-box border-b-2 border-button outline-none text-text placeholder-transparent focus:border-button transition"
            />

            <label
              className="absolute left-4 top-4 text-gray-400 text-sm transition-all 
              peer-placeholder-shown:top-4
              peer-placeholder-shown:text-base
              peer-focus:top-1
              peer-focus:text-sm
              peer-focus:text-button"
            >
              Confirm Password
            </label>

            <span
              className="absolute right-4 top-4 text-gray-400 cursor-pointer"
              onClick={() => setShowConfirm(!showConfirm)}
            >
              {showConfirm ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-xl bg-button text-white font-semibold shadow-lg hover:opacity-90 transition flex justify-center items-center"
          >
            {loading ? (
              <CircularProgress size={22} color="inherit" />
            ) : (
              "Update Password"
            )}
          </button>
        </form>

        <p className="text-gray-400 text-center mt-6">
          Back to{" "}
          <Link href="/dashboard/login" className="text-button hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ChangePasswordpage;
