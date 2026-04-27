"use client";

import React, { useContext, useRef, useState, useEffect } from "react";
import Cookies from "js-cookie";
import { postData } from "@/utils/api";
import { MyContext } from "@/context/ThemeContext";
import { useRouter } from "next/navigation";

const OTPPage = () => {
  const router = useRouter();
  const context = useContext(MyContext);

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputs = useRef([]);

  // resend timer state
  const [timeLeft, setTimeLeft] = useState(60);
  const [canResend, setCanResend] = useState(false);

  // timer effect
  useEffect(() => {
    if (timeLeft <= 0) {
      setCanResend(true);
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft]);

  // otp input change
  const handleChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputs.current[index - 1].focus();
    }
  };

  // verify otp
  const handleSubmit = async (e) => {
    e.preventDefault();

    const code = otp.join("");

    if (code.length !== 6) {
      context?.alertBox("Error", "Enter 6 digit OTP");
      return;
    }

    const actionType = Cookies.get("actionType");
    if (actionType === "verifyEmail") {
      postData("/api/v1/verifyEmail", {
        email: Cookies.get("userEmail"),
        otp: code,
      }).then((res) => {
        if (res?.error === false) {
          context?.alertBox("Success", res?.message);

          Cookies.remove("userEmail");
          Cookies.remove("actionType");

          router.push("/");
        } else {
          context?.alertBox("Error", res?.message);
        }
      });
    }

    if(actionType === 'forgot-password'){
      postData("/api/v1/verify-forgot-password-otp", {
        email: Cookies.get("userEmail"),
        otp: code,
      }).then((res) => {
        if (res?.error === false) {
          context?.alertBox("Success", res?.message);
          router.push("/change-password");
        } else {
          context?.alertBox("Error", res?.message);
        }
      });
    }
  };

  const resendOTP = async () => {
    if (!canResend) return;

    const res = await postData("/api/v1/resend-otp", {
      email: Cookies.get("userEmail"),
    });

    context?.alertBox("Info", res?.message);

    setTimeLeft(60);
    setCanResend(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-button/5 backdrop-blur-xl border border-white/10 shadow-xl shadow-black/40 p-8 rounded-3xl w-full max-w-md"
      >
        <h2 className="text-2xl font-semibold text-text text-center">
          Verify OTP
        </h2>

        <p className="text-gray-400 text-sm text-center mt-2">
          Enter the 6 digit code sent to your email
        </p>

        <p className="text-gray-400 text-sm text-center mt-2">
          OTP sent to{" "}
          <span className="text-text">{Cookies.get("userEmail")}</span>
        </p>

        {/* OTP inputs */}
        <div className="flex justify-between mt-8 gap-3">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputs.current[index] = el)}
              type="text"
              maxLength="1"
              value={digit}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className="w-12 h-14 text-center text-lg rounded-xl
              bg-imgcard border-b-2 border-button outline-none
              text-text shadow-md focus:border-blue-400"
            />
          ))}
        </div>

        {/* button */}
        <button
          type="submit"
          className="w-full mt-8 p-4 rounded-2xl bg-button
          text-white font-medium shadow-lg shadow-button/40
          hover:scale-[1.02] transition"
        >
          Verify Code
        </button>

        {/* resend */}
        <p className="text-center text-gray-400 text-sm mt-6">
          Didn't receive code?{" "}
          {canResend ? (
            <span
              onClick={resendOTP}
              className="text-blue-400 cursor-pointer hover:underline"
            >
              Resend OTP
            </span>
          ) : (
            <span className="text-gray-500">Resend in {timeLeft}s</span>
          )}
        </p>
      </form>
    </div>
  );
};

export default OTPPage;
