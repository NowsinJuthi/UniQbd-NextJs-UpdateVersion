"use client";

import React, { useState } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { postData } from "@/utils/api";
import { useRouter } from "next/navigation";
import CircularProgress from "@mui/material/CircularProgress";
import Cookies from 'js-cookie'


const RegistrationPage = () => {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
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
      const res = await postData("/api/v1/register", formData);
      console.log(res)
      if (res?.success) {
        toast.success("OTP sent to your email 📩");

        Cookies.set('userEmail', formData.email)
         Cookies.set('actionType', 'verifyEmail')
        setFormData({
          name: "",
          email: "",
          password: "",
        });

        router.push("/otp");
      } else {
        toast.error(res?.message || "Registration failed ❌");
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat">
      <div className="bg-imgcard backdrop-blur-md w-full max-w-xl rounded-[2%] shadow-2xl px-18 py-20 shadow-lg shadow-button/30">
        <h1 className="text-3xl font-bold text-text text-center mb-2">
          Create Account
        </h1>

        <p className="text-center text-text mb-6 text-sm">
          Register to get started
        </p>

        <form onSubmit={onSubmitHandler}>
          {/* Name */}
          <div className="relative">
            <label htmlFor="name" className="sr-only">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              autoComplete="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={onChangeHandler}
              className="peer p-4 rounded-2xl w-full outline-none border-b-3 border-button text-gray-100 shadow-lg bg-box"
            />
          </div>

          {/* Email */}
          <div className="relative mt-4">
            <label htmlFor="email" className="sr-only">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              autoComplete="email"
              placeholder="Email"
              value={formData.email}
              onChange={onChangeHandler}
              className="peer p-4 rounded-2xl w-full outline-none border-b-3 border-button text-gray-100 shadow-lg bg-box"
            />
          </div>

          {/* Password */}
          <div className="relative mt-4">
            <label htmlFor="password" className="sr-only">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              required
              autoComplete="new-password"
              placeholder="Password"
              value={formData.password}
              onChange={onChangeHandler}
              className="peer p-4 rounded-2xl w-full outline-none border-b-2 border-button text-gray-100 shadow-lg bg-box"
            />
            <button
              type="button"
              name="togglePassword"
              aria-label={showPassword ? "Hide password" : "Show password"}
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 bg-button text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-button/90 transition shadow-lg"
          >
            {loading && <CircularProgress size={20} sx={{ color: "white" }} />}
            {loading ? "Processing..." : "Register"}
          </button>
        </form>

        <p className="text-center text-sm text-text mt-6">
          Already have an account?
          <Link href="/dashboard/login" className="ml-1 underline">
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegistrationPage;