"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";
import { useSearchParams, useRouter } from "next/navigation";
import AdminMenuPage from "../Menu/page";
import api, { appUrl } from "@/utils/api";




const ReactQuill = dynamic(
  () => import("react-quill-new"),
  { ssr: false }
);
const Products = () => {

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ color: [] }, { background: [] }],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ align: [] }],
      ["link"],
      ["clean"],
    ],
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "color",
    "background",
    "list",
    "align",
    "link",
  ];


  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("editId");

  const [editPackageIndex, setEditPackageIndex] = useState(null);
  const [categories, setCategories] = useState([]);
  const [packages, setPackages] = useState([]);
  const [packageImagePreview, setPackageImagePreview] = useState(null);


  const [packageInput, setPackageInput] = useState({
    name: "",
    quantity: "",
    price: "",
    discountPrice: "",
  });

  const [formData, setFormData] = useState({
    name: "",
    shortDescription: "",
    description: "",
    category: "",
    photo: null,
    packageImage: null,
  });

  const [photoPreview, setPhotoPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  // ================= FETCH CATEGORIES =================
  useEffect(() => {
    api
      .get(
        "/category"
      )
      .then((res) => setCategories(res.data.categories || []))
      .catch((err) => console.log("Category error:", err.message));
  }, []);

  // ================= FETCH PRODUCT =================
  useEffect(() => {
    if (!editId) return;

    api
      .get(
        `/product/${editId}`
      )
      .then((res) => {
        const product = res.data.product;

        setFormData({
          name: product.name || "",
          shortDescription: product.shortDescription || "",
          description: product.description || "",
          category: product.category?._id || product.category || "",
          photo: null,
          packageImage: null,
        });

        if (product.photo || product.packageImage) {
          setPhotoPreview(
            `${appUrl}/uploads/${product.photo || product.packageImage}`
          );
        }

        if (product.packageImage) {
          setPackageImagePreview(
            `${appUrl}/uploads/${product.packageImage}`
          );
        }

        setPackages(product.packageType || []);
      })
      .catch((err) =>
        console.log("Fetch product error:", err?.response?.data || err.message)
      );
  }, [editId]);

  // ================= INPUT CHANGE =================
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "photo") {
      const file = files?.[0];
      if (!file) return;

      setFormData((prev) => ({
        ...prev,
        photo: file,
      }));

      setPhotoPreview(URL.createObjectURL(file));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // ================= PACKAGE INPUT =================
  const handlePackageChange = (e) => {
    const { name, value } = e.target;

    setPackageInput((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ================= ADD PACKAGE =================
  const addPackage = () => {
    if (
      !packageInput.name ||
      !packageInput.quantity ||
      !packageInput.price
    ) {
      alert("Please fill package name, quantity, and price.");
      return;
    }

    const newPackage = { ...packageInput };

    if (editPackageIndex !== null) {
      const updated = [...packages];
      updated[editPackageIndex] = newPackage;
      setPackages(updated);
      setEditPackageIndex(null);
    } else {
      setPackages((prev) => [...prev, newPackage]);
    }

    setPackageInput({
      name: "",
      quantity: "",
      price: "",
      discountPrice: "",
    });
  };

  // ================= REMOVE PACKAGE =================
  const removePackage = (index) => {
    setPackages((prev) => prev.filter((_, i) => i !== index));
  };

  // ================= EDIT PACKAGE =================
  const editPackage = (index) => {
    if (!packages[index]) return;

    setPackageInput({ ...packages[index] });
    setEditPackageIndex(index);
  };

  // ================= SAVE PRODUCT =================
  const saveProduct = async () => {
    if (!formData.name || !formData.category) {
      alert("Please fill required fields.");
      return;
    }

    try {
      setLoading(true);

      const data = new FormData();

      data.append("name", formData.name);
      data.append("shortDescription", formData.shortDescription);
      data.append("description", formData.description);
      data.append("category", formData.category);

      if (formData.photo) {
        data.append("photo", formData.photo);
      }

      if (formData.packageImage) {
        data.append("packageImage", formData.packageImage);
      }

      const cleanPackages = packages.map((p) => ({
        name: p.name,
        quantity: p.quantity,
        price: p.price,
        discountPrice: p.discountPrice,
      }));

      data.append("packageType", JSON.stringify(cleanPackages));

      const url = editId
        ? `/product/${editId}`
        : `/product`;

      if (editId) {
        await api.put(url, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Product updated successfully!");
      } else {
        await api.post(url, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Product created successfully!");
      }

      setFormData({
        name: "",
        shortDescription: "",
        description: "",
        category: "",
        photo: null,
        packageImage: null,
      });

      setPhotoPreview(null);
      setPackages([]);

      router.push("/admin/all-products");
    } catch (error) {
      console.log("Save product error:", error?.response?.data || error.message);
      alert("Failed to save product.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-12 gap-6 p-6 bg-background min-h-screen">
      <div className="md:col-span-3 p-8 border-r bg-button/5">
        <AdminMenuPage />
      </div>

      <div className="col-span-12 md:col-span-9">
        <h1 className="text-3xl font-bold mb-8">
          {editId ? "Edit Product" : "Add New Product"}
        </h1>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm mb-2 block">Product Name *</label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              type="text"
              className="w-full bg-button/10 shadow-inner shadow-button/20 rounded-xl px-4 py-3 text-button"
            />
          </div>

          <div className="md:col-span-2">
            <label className="text-sm mb-2 block">Category *</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full bg-button/10 shadow-inner shadow-button/20 rounded-xl px-4 py-3 text-button"
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="text-sm mb-2 block">Short Description</label>
            <input
              name="shortDescription"
              value={formData.shortDescription}
              onChange={handleChange}
              className="w-full bg-button/10 shadow-inner shadow-button/20 rounded-xl px-4 py-3 text-button"
            />
          </div>

          {/* Rich Text Editor */}
          <div className="md:col-span-2">
            <div className="bg-button/5 border border-button/10 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <label className="text-base font-semibold text-button">
                    Product Description
                  </label>
                  <p className="text-xs text-gray-500 mt-1">
                    Write detailed information about the product, features,
                    benefits and usage instructions.
                  </p>
                </div>

                <span className="text-xs bg-button/10 text-button px-3 py-1 rounded-full">
                  Rich Editor
                </span>
              </div>

              <div className="bg-button/5 rounded-xl overflow-hidden quill-wrapper">
                <ReactQuill
                  theme="snow"
                  value={formData.description}
                  onChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: value,
                    }))
                  }
                  modules={modules}
                  formats={formats}
                  placeholder="Write a professional product description..."
                />
              </div>

              <div className="flex justify-between items-center mt-2">
                <p className="text-xs text-gray-500">
                  Use headings, lists, colors and links for better formatting.
                </p>

                <span className="text-xs text-button">
                  {formData.description.replace(/<[^>]*>/g, "").length} Characters
                </span>
              </div>
            </div>
          </div>


          <div>
            <label className="text-sm mb-2 block">Product Image *</label>

            <input
              name="photo"
              type="file"
              accept="image/*"
              onChange={handleChange}
              className="w-full bg-button/10 shadow-inner shadow-button/20 rounded-xl px-4 py-3 text-button"
            />

            {photoPreview && (
              <div className="mt-3 relative inline-block">

                <img
                  src={photoPreview}
                  alt="Preview"
                  className="w-32 h-32 object-contain rounded-lg border"
                />

                {/* REMOVE BUTTON */}
                <button
                  type="button"
                  onClick={() => {
                    setPhotoPreview(null);
                    setFormData((prev) => ({
                      ...prev,
                      photo: null,
                    }));
                  }}
                  className="absolute -top-2 -right-2 bg-red-500 text-white w-6 h-6 rounded-full"
                >
                  ×
                </button>

              </div>
            )}
          </div>

          <div className="md:col-span-2 mt-4 p-4 border rounded-xl bg-button/5">
            <h2 className="text-lg font-semibold mb-2">Add Package</h2>

            <div className="grid md:grid-cols-4 gap-2">
              <input
                name="name"
                value={packageInput.name}
                onChange={handlePackageChange}
                placeholder="Package Name"
                className="px-3 py-2 border rounded-lg"
              />
              <input
                name="quantity"
                value={packageInput.quantity}
                onChange={handlePackageChange}
                placeholder="Quantity"
                className="px-3 py-2 border rounded-lg"
              />
              <input
                name="price"
                value={packageInput.price}
                onChange={handlePackageChange}
                placeholder="Price"
                className="px-3 py-2 border rounded-lg"
              />
              <input
                name="discountPrice"
                value={packageInput.discountPrice}
                onChange={handlePackageChange}
                placeholder="Discount"
                className="px-3 py-2 border rounded-lg"
              />
            </div>

            <button
              type="button"
              onClick={addPackage}
              className="mt-2 bg-button text-white px-4 py-2 rounded-lg"
            >
              Add Package
            </button>

            <div className="mb-4 mt-3">
              <label className="text-sm mb-2 block">
                Package Image (All Packages)
              </label>

              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;

                  setFormData((prev) => ({
                    ...prev,
                    packageImage: file,
                  }));

                  setPackageImagePreview(URL.createObjectURL(file));
                }}
                className="w-full px-3 py-2 rounded-lg border"
              />

              {/* PREVIEW */}
              {packageImagePreview && (
                <div className="mt-3 relative inline-block">
                  <img
                    src={packageImagePreview}
                    className="w-32 h-32 object-cover rounded-lg border"
                  />

                  {/* REMOVE BUTTON */}
                  <button
                    type="button"
                    onClick={() => {
                      setPackageImagePreview(null);
                      setFormData((prev) => ({
                        ...prev,
                        packageImage: null,
                      }));
                    }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white w-6 h-6 rounded-full"
                  >
                    ×
                  </button>
                </div>
              )}
            </div>

            {packages.length > 0 && (
              <div className="mt-4">
                {packages.map((p, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center mt-2 bg-button/10 p-2 rounded-lg"
                  >
                    <span>
                      {p.name} - {p.quantity} - {p.price} TK
                      {p.discountPrice && ` (${p.discountPrice} TK)`}
                    </span>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => editPackage(index)}
                        className="text-blue-500 font-bold"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => removePackage(index)}
                        className="text-red-500 font-bold"
                      >
                        X
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mt-8">
          <button
            onClick={saveProduct}
            disabled={loading}
            className={`w-full py-3 rounded-xl text-white font-semibold ${loading ? "bg-button/50 cursor-not-allowed" : "bg-button"
              }`}
          >
            {loading
              ? editId
                ? "Updating..."
                : "Creating..."
              : editId
                ? "Update Product"
                : "Create Product"}
          </button>
        </div>
      </div>
    </div >
  );
};

export default Products;