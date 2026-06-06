"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import AdminMenuPage from "../Menu/page";
import api from "@/utils/api";

const Review = () => {
  const [reviews, setReviews] = useState([]);

  // ================= GET ALL REVIEWS =================
  const getAllReviews = async () => {
    try {
      const res = await api.get(`/admin/all`, {
        withCredentials: true,
      });

      setReviews(res.data.reviews || []);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllReviews();
  }, []);

  // ================= APPROVE REVIEW =================
  const approveReview = async (id) => {
    try {
      await api.put(
        `/approve/${id}`,
        {},
        { withCredentials: true }
      );

      toast.success("Approved!");
      getAllReviews();
    } catch (error) {
      console.log(error);
    }
  };

  // ================= EDIT REVIEW =================
  const editReview = async (review) => {
    const newComment = prompt("Edit your review:", review.comment);

    if (!newComment) return;

    try {
      await api.put(
        `/review/update/${review._id}`,
        { comment: newComment },
        { withCredentials: true }
      );

      toast.success("Review Updated!");
      getAllReviews();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="grid grid-cols-12 gap-6 p-6">
      <div className="md:col-span-3 p-8 border-r bg-button/5">
        <AdminMenuPage />
      </div>

      <div className="col-span-12 md:col-span-9">
        <h1 className="text-3xl font-bold mb-8">Customer Reviews</h1>

        <div className="bg-button/5 rounded-2xl p-6 space-y-6">
          {reviews.map((review) => (
            <div
              key={review._id}
              className="bg-button/5 p-5 rounded-xl flex justify-between items-start"
            >
              <div>
                <h3 className="text-lg font-semibold">
                  Product: {review.productId?.name || "Unknown Product"}
                </h3>

                <h3 className="text-lg font-semibold">
                  Name: {review.name}
                </h3>

                <p className="mt-2">Review: {review.comment}</p>

                <p className="text-yellow-400 mt-1">
                  {"★".repeat(review.rating)}
                </p>

                <p className="text-gray-400 text-sm mt-2">
                  {new Date(review.createdAt).toDateString()}
                </p>

                {!review.approved && (
                  <p className="text-red-400 text-sm mt-1">
                    Pending Approval
                  </p>
                )}
              </div>

              <div className="flex gap-2">
                {!review.approved && (
                  <button
                    onClick={() => approveReview(review._id)}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm"
                  >
                    Approve
                  </button>
                )}

                <button
                  onClick={() => editReview(review)}
                  className="bg-button hover:bg-button/70 text-white px-4 py-2 rounded-lg text-sm"
                >
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Review;