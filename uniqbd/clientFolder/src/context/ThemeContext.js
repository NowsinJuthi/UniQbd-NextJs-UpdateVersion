"use client";

import { createContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
export const MyContext = createContext();

export const ThemeContextProvider = ({ children }) => {
  const [isLogin, setIsLogin] = useState(false);
  const [alert, setAlert] = useState({
    open: false,
    type: "",
    message: "",
  });

  const [user, setUser] = useState({
    email: "",
    mane: "",
  });

 useEffect(() => {
  const name = Cookies.get("userName");
  const email = Cookies.get("userEmail");

  if (name && email) {
    setUser({
      name,
      email,
    });
    setIsLogin(true);
  }

}, []);

  const alertBox = (type, message) => {
    setAlert({
      open: true,
      type,
      message,
    });

    setTimeout(() => {
      setAlert({
        open: false,
        type: "",
        message: "",
      });
    }, 3000);
  };

  const values = {
    alert,
    alertBox,
    isLogin,
    setIsLogin,
    setUser,
    user,
  };

  return (
    <MyContext.Provider value={values}>
      {children}

      {/* Alert UI */}
      {alert.open && (
        <div className="fixed top-5 right-5 z-50">
          <div
            className={`px-6 py-3 rounded-xl shadow-lg text-white
            ${
              alert.type === "Success"
                ? "bg-green-500"
                : alert.type === "Error"
                  ? "bg-red-500"
                  : "bg-blue-500"
            }`}
          >
            {alert.message}
          </div>
        </div>
      )}
    </MyContext.Provider>
  );
};
