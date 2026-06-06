import axios from "axios";

export const appUrl = process.env.NEXT_PUBLIC_API_URL;


export const publicApi = axios.create({
  baseURL: `${appUrl}/api/v1`,
  withCredentials: true,
});


export const api = axios.create({
  baseURL: `${appUrl}/api/v1`,
  withCredentials: true,
});


api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log("URL:", error.config?.url);
    console.log("STATUS:", error.response?.status);
    console.log("DATA:", error.response?.data);

    const status = error?.response?.status;


    if (status === 401 && typeof window !== "undefined") {
      const path = window.location.pathname;

      const isProtectedRoute =
        path.startsWith("/dashboard") ||
        path.startsWith("/admin");

      if (isProtectedRoute) {
        alert("Please login first");
        window.location.href = "/dashboard/login";
      }
    }


    if (status === 403 && typeof window !== "undefined") {
      alert("⚠️ You are not allowed to access this page (Admin only)");

      const path = window.location.pathname;

      const isAdminRoute = path.startsWith("/admin");

      if (isAdminRoute) {
        window.location.href = "/";
      }
    }

    console.error(
      "API Error:",
      error?.response?.data || error.message
    );

    return Promise.reject(error);
  }
);

// GET
export const fetchDataFromApi = async (url) => {
  try {
    const { data } = await api.get(url);
    return data;
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};

// POST
export const postData = async (url, formData) => {
  try {
    const { data } = await api.post(url, formData);
    return data;
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};

// PUT
export const putData = async (url, formData) => {
  try {
    const { data } = await api.put(url, formData);
    return data;
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};

// DELETE
export const deleteData = async (url) => {
  try {
    const { data } = await api.delete(url);
    return data;
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};

// UPLOAD IMAGE
export const uploadImage = async (url, formData) => {
  try {
    const { data } = await api.post(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return data;
  } catch (error) {
    return {
      success: false,
      error:
        error?.response?.data?.message || error.message,
    };
  }
};


export default api;