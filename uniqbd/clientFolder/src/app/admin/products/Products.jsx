"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams, useRouter } from "next/navigation";
import AdminMenuPage from "../Menu/page";


const Products = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("editId");



  const [editPackageIndex, setEditPackageIndex] = useState(null);
  const [categories, setCategories] = useState([]);
  const [packages, setPackages] = useState([]);
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
  });

  const [photoPreview, setPhotoPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  //Fetch categories
  useEffect(() => {
    axios
      .get("http://localhost:3001/api/v1/category")
      .then((res) => setCategories(res.data.categories))
      .catch(console.log);
  }, []);

  //Fetch product
  useEffect(() => {
    if (editId) {
      axios
        .get(`http://localhost:3001/api/v1/product/${editId}`)
        .then((res) => {
          const product = res.data.product;

          setFormData({
            name: product.name || "",
            shortDescription: product.shortDescription || "",
            description: product.description || "",
            category: product.category?._id || product.category || "",
            photo: null,
          });

          //Image preview
          if (product.photo) {
            setPhotoPreview(
              `http://localhost:3001/uploads/${product.photo}`
            );
          }

          // Packages
          setPackages(product.packageType || []);
        })
        .catch((err) => console.log("Fetch product error:", err));
    }
  }, [editId]);

  // Input change
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "photo") {
      const file = files[0];
      setFormData({ ...formData, photo: file });
      setPhotoPreview(URL.createObjectURL(file));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Package input change
  const handlePackageChange = (e) => {
    const { name, value } = e.target;

    setPackageInput({
      ...packageInput,
      [name]: value,
    });
  };

  //  Add package
  const addPackage = () => {
    if (!packageInput.name || !packageInput.quantity || !packageInput.price) {
      alert("Please fill package name, quantity, and price.");
      return;
    }

    // If editing existing package
    if (editPackageIndex !== null) {
      const updatedPackages = [...packages];
      updatedPackages[editPackageIndex] = packageInput;
      setPackages(updatedPackages);
      setEditPackageIndex(null);
    } else {
      setPackages([...packages, packageInput]);
    }

    setPackageInput({
      name: "",
      quantity: "",
      price: "",
      discountPrice: "",

    });
  };

  // Remove package
  const removePackage = (index) => {
    setPackages(packages.filter((_, i) => i !== index));
  };

  // Save product
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

      if (editId) {
        //  UPDATE
        await axios.put(
          `http://localhost:3001/api/v1/product/${editId}`,
          data,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        alert("Product updated successfully!");
      } else {
        //CREATE
        await axios.post(
          `http://localhost:3001/api/v1/product`,
          data,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        alert("Product created successfully!");
      }

      // Reset form
      setFormData({
        name: "",
        shortDescription: "",
        description: "",
        category: "",
        photo: null,
      });

      setPhotoPreview(null);
      setPackages([]);

      router.push("/admin/all-products");
    } catch (error) {
      console.log("Save product error:", error);
      alert("Failed to save product.");
    } finally {
      setLoading(false);
    }
  };


  const editPackage = (index) => {
    setPackageInput(packages[index]);
    setEditPackageIndex(index);
  };

  return (
    <div className="grid grid-cols-12 gap-6 p-6 bg-background min-h-screen">
      {/* Sidebar */}
      <div className="md:col-span-3 p-8 border-r bg-button/5">
        <AdminMenuPage />
      </div>

      {/* Form */}
      <div className="col-span-12 md:col-span-9">
        <h1 className="text-3xl font-bold mb-8">
          {editId ? "Edit Product" : "Add New Product"}
        </h1>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Product Name */}
          <div>
            <label className="text-sm mb-2 block">Product Name *</label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              type="text"
              placeholder="Enter product name"
              className="w-full bg-button/10 shadow-inner shadow-button/20 rounded-xl px-4 py-3 text-button"
            />
          </div>

          {/* Category */}
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

          {/* Short Description */}
          <div className="md:col-span-2">
            <label className="text-sm mb-2 block">Short Description</label>
            <input
              name="shortDescription"
              value={formData.shortDescription}
              onChange={handleChange}
              type="text"
              placeholder="Short description"
              className="w-full bg-button/10 shadow-inner shadow-button/20 rounded-xl px-4 py-3 text-button"
            />
          </div>

          {/* Long Description */}
          <div className="md:col-span-2">
            <label className="text-sm mb-2 block">Long Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              placeholder="Long product description..."
              className="w-full bg-button/10 shadow-inner shadow-button/20 rounded-xl px-4 py-3 text-button"
            />
          </div>

          {/* Photo */}
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
              <img
                src={photoPreview}
                alt="Preview"
                className="mt-2 w-32 h-32 object-contain rounded-lg border"
              />
            )}
          </div>

          {/* Packages */}
          <div className="md:col-span-2 mt-4 p-4 border rounded-xl bg-button/5">
            <h2 className="text-lg font-semibold mb-2">Add Package</h2>

            <div className="grid md:grid-cols-4 gap-2">
              <input name="name" value={packageInput.name} onChange={handlePackageChange} type="text" placeholder="Package Name" className="w-full px-3 py-2 rounded-lg border" />
              <input name="quantity" value={packageInput.quantity} onChange={handlePackageChange} type="number" placeholder="Quantity" className="w-full px-3 py-2 rounded-lg border" />
              <input name="price" value={packageInput.price} onChange={handlePackageChange} type="number" placeholder="Regular Price" className="w-full px-3 py-2 rounded-lg border" />
              <input name="discountPrice" value={packageInput.discountPrice} onChange={handlePackageChange} type="number" placeholder="Discount Price" className="w-full px-3 py-2 rounded-lg border" />

            </div>

            <button type="button" onClick={addPackage} className="mt-2 bg-button text-white font-semibold px-4 py-2 rounded-lg">
              Add Package
            </button>

            <div className="mb-4">
              <label className="text-sm mb-2 block">
                Package Image (All Packages)
              </label>

              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setFormData({ ...formData, packageImage: e.target.files[0] })
                }
                className="w-full px-3 py-2 rounded-lg border"
              />
            </div>
            {packages.length > 0 && (
              <div className="mt-4">
                <h3 className="font-semibold">Packages:</h3>
                <ul>
                  {packages.map((p, index) => (
                    <li key={index} className="flex justify-between items-center mt-1 bg-button/10 p-2 rounded-lg">
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
                    </li>
                  ))}
                </ul>
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
    </div>
  );
};

export default Products;