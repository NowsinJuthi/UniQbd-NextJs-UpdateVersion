"use client";

import React, { useState } from "react";
import Link from "next/link";
import { FiMail } from "react-icons/fi";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { postData } from "@/utils/api";

const ForgotPassword = () => {
  const [formData, setFormData] = useState({
    email: "",
  });

  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

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

    setTimeout(() => {
      setLoading(false);
      setSuccess(true);

      Cookies.set("actionType", "forgot-password");
      Cookies.set("userEmail", formData.email);


      postData('/api/v1/forgot-password', formData).then((res)=>{
        if(res?.error !== true){
          setLoading(false)
           router.push("/otp");
        }else{
          context?.alerBox('error', res?.message);
          setLoading(false)
        }
      })
     
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-5">
      <div className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-3xl p-8">
        <h1 className="text-3xl font-bold text-center text-text mb-2">
          Forgot Password
        </h1>

        <p className="text-gray-400 text-center mb-8">
          Enter your email to receive reset link
        </p>

      
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={onChangeHandler}
                className="peer w-full p-4 rounded-xl bg-box border-b-2 border-button outline-none text-text placeholder-transparent focus:border-button transition"
                placeholder="Email"
              />

              <label
                className="absolute left-4 top-4 text-gray-400 text-sm transition-all 
                peer-placeholder-shown:top-4
                peer-placeholder-shown:text-base
                peer-focus:top-1
                peer-focus:text-sm
                peer-focus:text-button"
              >
                Email Address
              </label>

              <FiMail className="absolute right-4 top-4 text-gray-400" />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl bg-button text-white font-semibold shadow-lg hover:opacity-90 transition"
            >
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </form>
       

        <p className="text-gray-400 text-center mt-6">
          Remember password?{" "}
          <Link href="/dashboard/login" className="text-button hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
