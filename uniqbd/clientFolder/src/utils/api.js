import axios from "axios";
import Cookies from "js-cookie";


const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3001";

export const postData = async (url, formData) => {
  try {
    const response = await fetch(appUrl + url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${Cookies.get("accessToken") || ""}`,
      },
      body: JSON.stringify(formData),
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return { error: errorData };
    }

    const data = await response.json();
    return data;
  } catch (err) {
    console.log("Error:", err.message);
    return { error: err.message };
  }
};

export const uploadImage = async (url, formData) => {
  if (!url) throw new Error("Upload URL missing");


  const fullUrl = url.startsWith("http") ? url : appUrl + (url.startsWith("/") ? url : "/" + url);

  try {
    const response = await axios.post(fullUrl, formData, {
      headers: {
        Authorization: `Bearer ${Cookies.get("accessToken") || ""}`,

      },
      withCredentials: true,
    });
    return response.data; 
  } catch (error) {
    console.error("Upload error:", error);
    return { success: false, message: error.message };
  }
};

export const fetchDataFromApi = async (url) => {
  try {
    const { data } = await axios.get(appUrl + url, {
      headers: {
        Authorization: `Bearer ${Cookies.get("accessToken") || ""}`,
      },
    });
    return data;
  } catch (error) {
    console.error(error);
    return { error: error.message };
  }
};