"use client";

import React, { useContext, useState } from "react";
import Link from "next/link";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import CircularProgress from "@mui/material/CircularProgress";
import { toast } from "react-toastify";
import { postData } from "@/utils/api";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { MyContext } from "@/context/ThemeContext";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { setUser, setIsLogin } = useContext(MyContext);

  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setFormData((form) => ({
      ...form,
      [name]: value,
    }));
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { email, password } = formData;
      const res = await postData("/login", {
        email,
        password,
      });

      if (res?.error) {
        toast.error(res?.message || "Login failed ");
        return;
      }

      toast.success("Login successful");

      Cookies.set("userEmail", res?.data?.userEmail);
      Cookies.set("userName", res?.data?.userName);
      Cookies.set("actionType", "verifyEmail");

      setUser({
        email: res?.data?.email,
        name: res?.data?.userName,
        role: res?.data?.role,
      });

      setIsLogin(true);

      if (res?.data?.role === "ADMIN") {
        router.push("/admin");
      } else {
        router.push("/my-account");
      }
    } catch (err) {
      toast.error("Server error ⚠️");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat px-4 sm:px-6">
      <div
        className="bg-imgcard backdrop-blur-md shadow-lg shadow-button/30
       w-full max-w-xl rounded-[2%] px-6 sm:px-10 md:px-18 py-14 sm:py-16 md:py-20"
      >
        {/* Title */}
        <h1 className="text-3xl font-bold text-text text-center mb-2 [text-shadow:0_1px_0_rgba(255,255,255,0.3),0_6px_15px_rgba(0,0,0,0.35)]">
          Welcome Back
        </h1>
        <p className="text-center text-text mb-6 text-sm">
          Login to continue
        </p>

        <form onSubmit={onSubmitHandler}>
          {/* Email Field */}
          <div className="relative">
            <input
              type="email"
              name="email"
              required
              className="peer p-4 rounded-2xl w-full outline-none border-b-3
             border-button focus:border-button text-gray-100 placeholder-transparent shadow-lg bg-box transition"
              placeholder="Email Address"
              value={formData.email}
              onChange={onChangeHandler}
            />
            <label className="absolute left-4 top-4 text-gray-400 text-sm pointer-events-none
                 peer-focus:text-gray-300 peer-focus:text-sm peer-focus:-translate-y-3 transition-all
                 peer-valid:text-butt peer-valid:text-xs peer-valid:-translate-y-3">
              Email Address
            </label>
          </div>

          {/* Password Field */}
          <div className="relative mt-4">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              required
              className="peer p-4 rounded-2xl w-full outline-none border-b-2
        border-button focus:border-button text-gray-100 placeholder-transparent
        shadow-lg bg-box transition"
              placeholder="Password"
              value={formData.password}
              onChange={onChangeHandler}
            />

            <label
              className="absolute left-4 top-4 text-gray-400 text-sm pointer-events-none
        transition-all
        peer-placeholder-shown:top-4
        peer-placeholder-shown:text-base
        peer-focus:-translate-y-3
        peer-focus:text-xs
        peer-valid:-translate-y-3
        peer-valid:text-xs"
            >
              Password
            </label>

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          {/* Forgot Password */}
          <div className="text-right mb-6">
            <Link
              href="/forgot-password"
              className="text-sm text-gray-100 hover:underline"
            >
              Forgot Password?
            </Link>
          </div>

          {/* Login Button */}
          <button className="w-full bg-button text-white py-3 rounded-lg font-semibold hover:bg-button/90 transition duration-300 shadow-lg shadow-button-500/30 flex items-center justify-center gap-2">
            {loading && (
              <CircularProgress size={18} sx={{ color: "white" }} />
            )}
            {loading ? "Processing..." : "Log In"}
          </button>
        </form>

        {/* Extra Links */}
        <p className="text-center text-sm text-text mt-6">
          Don't have an account?{" "}
          <Link
            href="/dashboard/registration"
            className="text-text font-medium hover:underline"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;