import axios from "axios";
import Cookies from "js-cookie";

const appUrl =
  process.env.NEXT_PUBLIC_APP_URL ||
  "https://uniqbd-nextjs-updateversion-backend.onrender.com";

const API = axios.create({
  baseURL: "https://uniqbd-nextjs-updateversion-backend.onrender.com",
  withCredentials: true,
});
// Add token automatically
API.interceptors.request.use((config) => {
  const token = Cookies.get("accessToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// ================= POST =================
export const postData = async (url, data) => {
  try {
    const res = await API.post(url, data);
    return res.data;
  } catch (err) {
    return {
      error: err.response?.data || err.message,
    };
  }
};

// ================= GET =================
export const fetchDataFromApi = async (url) => {
  try {
    const res = await API.get(url);
    return res.data;
  } catch (err) {
    return {
      error: err.response?.data || err.message,
    };
  }
};

// ================= UPLOAD =================
export const uploadImage = async (url, formData) => {
  try {
    const res = await API.post(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return res.data;
  } catch (err) {
    return {
      success: false,
      message: err.response?.data || err.message,
    };
  }
};