"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaTrash, FaEdit, FaSave, FaTimes } from "react-icons/fa";
import AdminMenuPage from "../Menu/page";
import api from "@/utils/api";

const CategoryPage = () => {
  const [name, setName] = useState("");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");

  // ================= FETCH =================
  const fetchCategories = async () => {
    try {
      const res = await api.get(
        "/category"
      );

      setCategories(res.data?.categories || []);
    } catch (error) {
      console.log("Fetch error:", error.message);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // ================= ADD CATEGORY =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) return alert("Category name required");

    try {
      setLoading(true);

      await api.post(
        "/category",
        { name }
      );

      setName("");
      fetchCategories();
    } catch (error) {
      console.log("Add error:", error?.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  // ================= DELETE =================
  const deleteCategory = async (id) => {
    if (!window.confirm("Delete this category?")) return;

    try {
      await api.delete(
        `/category/${id}`
      );

      fetchCategories();
    } catch (error) {
      console.log("Delete error:", error?.response?.data || error.message);
    }
  };

  // ================= EDIT =================
  const startEditing = (cat) => {
    setEditingId(cat._id);
    setEditingName(cat.name);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditingName("");
  };

  // ================= SAVE EDIT =================
  const saveEditing = async (id) => {
    if (!editingName.trim()) return alert("Category name required");

    try {
      await api.put(
        `/category/${id}`,
        { name: editingName }
      );

      setEditingId(null);
      setEditingName("");
      fetchCategories();
    } catch (error) {
      console.log("Update error:", error?.response?.data || error.message);
    }
  };

  return (
    <div className="grid grid-cols-12 gap-6 p-6">
      <div className="col-span-12 md:col-span-3">
        <AdminMenuPage />
      </div>

      <div className="col-span-12 md:col-span-9">
        <h1 className="text-2xl font-bold mb-6">Category Management</h1>

        {/* Add Category */}
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
            type="submit"
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
                        type="button"
                        onClick={() => saveEditing(cat._id)}
                        className="text-green-500 hover:text-green-600"
                      >
                        <FaSave />
                      </button>

                      <button
                        type="button"
                        onClick={cancelEditing}
                        className="text-gray-400 hover:text-gray-500"
                      >
                        <FaTimes />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => startEditing(cat)}
                        className="text-blue-400 hover:text-blue-500"
                      >
                        <FaEdit />
                      </button>

                      <button
                        type="button"
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