"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaTrash, FaEdit, FaSave, FaTimes } from "react-icons/fa";
import AdminMenuPage from "../Menu/page";

const CategoryPage = () => {
  const [name, setName] = useState("");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");

  const fetchCategories = async () => {
    try {
      const res = await axios.get("http://localhost:3001/api/v1/category");
      setCategories(res.data.categories || []);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Add new category
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name) return alert("Category name required");

    try {
      setLoading(true);
      await axios.post("http://localhost:3001/api/v1/category", { name });
      setName("");
      fetchCategories();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // Delete category
  const deleteCategory = async (id) => {
    if (!confirm("Delete this category?")) return;
    try {
      await axios.delete(`http://localhost:3001/api/v1/category/${id}`);
      fetchCategories();
    } catch (error) {
      console.log(error);
    }
  };

  // Start editing
  const startEditing = (cat) => {
    setEditingId(cat._id);
    setEditingName(cat.name);
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingId(null);
    setEditingName("");
  };

  // Save edited category
  const saveEditing = async (id) => {
    if (!editingName) return alert("Category name required");
    try {
      await axios.put(`http://localhost:3001/api/v1/category/${id}`, {
        name: editingName,
      });
      setEditingId(null);
      setEditingName("");
      fetchCategories();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="grid grid-cols-12 gap-6 p-6">
      <div className="col-span-12 md:col-span-3">
        <AdminMenuPage />
      </div>

      <div className="col-span-12 md:col-span-9">
        <h1 className="text-2xl font-bold mb-6">Category Management</h1>

        {/* Add Category Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-imgcard p-6 rounded-xl mb-8 space-y-4 border border-white/5"
        >
          <h2 className="font-semibold">Add Category</h2>

          <input
            type="text"
            placeholder="Category name"
            className="w-full p-3 rounded-lg bg-background border border-white/10 outline-none"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <button
            disabled={loading}
            className="bg-button px-6 py-2 rounded-lg text-white"
          >
            {loading ? "Adding..." : "Add Category"}
          </button>
        </form>

        {/* Category List */}
        <div className="bg-imgcard p-6 rounded-xl border border-white/5">
          <h2 className="font-semibold mb-4">All Categories</h2>

          <div className="space-y-3">
            {categories.map((cat) => (
              <div
                key={cat._id}
                className="flex justify-between items-center p-3 bg-background rounded-lg border border-white/5"
              >
                {/* Editable input */}
                {editingId === cat._id ? (
                  <input
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    className="w-full p-2 rounded-lg bg-background border border-white/10 outline-none mr-2"
                  />
                ) : (
                  <span>{cat.name}</span>
                )}

                <div className="flex gap-2">
                  {editingId === cat._id ? (
                    <>
                      <button
                        onClick={() => saveEditing(cat._id)}
                        className="text-green-500 hover:text-green-600"
                      >
                        <FaSave />
                      </button>
                      <button
                        onClick={cancelEditing}
                        className="text-gray-400 hover:text-gray-500"
                      >
                        <FaTimes />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => startEditing(cat)}
                        className="text-blue-400 hover:text-blue-500"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => deleteCategory(cat._id)}
                        className="text-red-400 hover:text-red-500"
                      >
                        <FaTrash />
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}

            {categories.length === 0 && (
              <p className="text-text/60 text-sm">No category found</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
