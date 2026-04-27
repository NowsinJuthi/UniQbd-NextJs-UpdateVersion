"use client";

import { useEffect, useState } from "react";
import axios from "axios";

const EditProductPage = () => {
  const [product, setProduct] = useState(null);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [photo, setPhoto] = useState(null);

  useEffect(() => {
    const data = localStorage.getItem("editProduct");
    if (data) {
      const prod = JSON.parse(data);
      setProduct(prod);
      setName(prod.name);
      setPrice(prod.price);
    }
  }, []);

  if (!product) return <p>Loading...</p>;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("price", price);
      if (photo) formData.append("photo", photo);

      await axios.put(
        `http://localhost:3001/api/v1/product/${product._id}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      alert("Product updated successfully!");
      localStorage.removeItem("editProduct"); 
      window.location.href = "/admin/products";
    } catch (error) {
      console.log("Update error:", error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Edit Product</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 rounded"
          placeholder="Product Name"
        />
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="border p-2 rounded"
          placeholder="Price"
        />
        <input
          type="file"
          onChange={(e) => setPhoto(e.target.files[0])}
          className="border p-2 rounded"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
        >
          Update Product
        </button>
      </form>
    </div>
  );
};

export default EditProductPage;