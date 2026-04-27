"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";

const ProductTabs = ({ product }) => {
  const [reviews, setReviews] = useState([]);
  const [reviewText, setReviewText] = useState("");
  const [loading, setLoading] = useState(false);

  const [activeTab, setActiveTab] = useState("description");
  const [rating, setRating] = useState(0);
  const [selectedPackage, setSelectedPackage] = useState(null);

  const packages = product?.packageType || product?.packages || [];

  const [user, setUser] = useState(null);

  // ================= FETCH USER =================
  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await axios.get("http://localhost:3001/api/v1/user", {
          withCredentials: true,
        });

        setUser(res.data.data); 
      } catch (error) {
        console.log(error);
      }
    };

    getUser();
  }, []);

  // ================= FETCH REVIEWS =================
  const fetchReviews = async () => {
    try {
      const res = await axios.get(
        `http://localhost:3001/api/v1/reviews/${product._id}`,
      );

      setReviews(res.data.reviews || []);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (!product?._id) return;
    fetchReviews();
  }, [product?._id]);

 
  const handleSubmitReview = async () => {
    if (!rating || !reviewText) {
      alert("Please give rating and comment");
      return;
    }

    if (!user) {
      alert("User not loaded yet");
      return;
    }

    try {
      setLoading(true);

      await axios.post("http://localhost:3001/api/v1/reviews", {
        productId: product._id,
        name: user.name, 
        rating,
        comment: reviewText,
      });

      alert("Review submitted! Waiting for admin approval.");

      setRating(0);
      setReviewText("");

      await fetchReviews(); 
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const menuItems = [
    { name: "Description", key: "description" },
    { name: "Reviews", key: "reviews" },
    { name: "Shipping & Delivery", key: "shipping" },
  ];

  return (
    <div className="mt-16">
      {/* Tabs */}
      <div className="flex flex-wrap gap-3 border-b border-white/10 pb-3 ">
        {menuItems.map((item) => {
          const isActive = activeTab === item.key;

          return (
            <button
              key={item.key}
              onClick={() => setActiveTab(item.key)}
              className="relative px-6 py-3 text-sm font-medium transition shadow-inner 
              shadow-button/20 rounded-2xl"
            >
              <span
                className={`relative z-10 ${
                  isActive ? "text-white" : "text-text/60"
                }`}
              >
                {item.name}
              </span>

              {isActive && (
                <motion.div
                  layoutId="tabIndicator"
                  className="absolute inset-0 bg-button rounded-xl shadow-md shadow-button/30"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              
            
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="mt-6 p-7 rounded-2xl border border-white/10 bg-gradient-to-br from-background via-imgcard to-background shadow-inner shadow-button/10 backdrop-blur-md">
        {/* DESCRIPTION */}
        {activeTab === "description" && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-2xl font-semibold text-text mb-4">
              Product Description
            </h2>

            {packages.map((pack, index) => (
              <div key={index}>
                <p className="text-text/70 leading-relaxed">
                  {product?.description}
                </p>
              </div>
            ))}
          </motion.div>
        )}

        {/* REVIEWS */}
        {activeTab === "reviews" && (
          <div className="grid md:grid-cols-2 gap-8 ">
            {/* Reviews list */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h2 className="text-2xl font-semibold text-text mb-1">
                Customer Reviews
              </h2>

              <p className="text-text/60 text-sm mb-6">
                Real feedback from verified customers
              </p>

              <div className="space-y-4">
                {reviews.length === 0 ? (
                  <p className="text-text/60">No reviews yet</p>
                ) : (
                  reviews.map((review) => (
                    <div
                      key={review._id}
                      className="p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition shadow-inner shadow-button/20"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-semibold text-text">
                          {review.name}
                        </span>

                        <span className="text-yellow-400">
                          {"★".repeat(review.rating)}
                        </span>
                      </div>

                      <p className="text-sm text-text/70">{review.comment}</p>

                      <p className="text-xs text-text/40 mt-2">
                        {new Date(review.createdAt).toDateString()}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </motion.div>

            {/* Add review */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur"
            >
              <h3 className="text-xl font-semibold text-text mb-5">
                Write a Review
              </h3>

              {/* rating */}
              <div className="mb-5">
                <label className="block text-sm text-text/70 mb-2">
                  Rating
                </label>

                <div className="flex gap-2 text-2xl">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      onClick={() => setRating(star)}
                      className={`cursor-pointer transition ${
                        rating >= star
                          ? "text-yellow-400 scale-110"
                          : "text-gray-500 hover:text-yellow-400"
                      }`}
                    >
                      ★
                    </span>
                  ))}
                </div>
              </div>

              {/* textarea */}
              <div className="mb-5">
                <label className="block text-sm text-text/70 mb-2">
                  Review
                </label>

                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  rows={4}
                  className="w-full shadow-inner shadow-button/20 p-3 rounded-lg bg-white/5 border border-white/10 text-text outline-none focus:ring-2 focus:ring-button resize-none"
                />
              </div>

              <button
                onClick={handleSubmitReview}
                className="w-full py-3 rounded-xl bg-button text-white font-medium shadow-lg shadow-button/20 hover:scale-[1.02] transition"
              >
                Submit Review
              </button>
            </motion.div>
          </div>
        )}

        {/* SHIPPING */}
        {activeTab === "shipping" && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-2xl font-semibold text-text mb-3">
              Shipping & Delivery
            </h2>

            <div className="space-y-3 text-text/70">
              <p>
                {product?.shipping?.instantDelivery
                  ? "Instant delivery for digital products after payment confirmation."
                  : "Manual processing required after payment."}
              </p>

              <p>Average delivery time: {product?.shipping?.deliveryTime}</p>

              <p>{product?.shipping?.note}</p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ProductTabs;
