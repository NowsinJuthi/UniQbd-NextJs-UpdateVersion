import reviewModel from "../models/reviewModel.js";

// GET reviews by product
export const getReviewsController = async (req, res) => {
  try {
    const { productId } = req.params;

    const reviews = await reviewModel
      .find({ productId, approved: true })
      .populate({
        path: "productId",
        select: "name",
      });

    res.json({ success: true, reviews });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// CREATE review
export const createReviewController = async (req, res) => {
  try {
    console.log("BODY:", req.body);

    const { productId, name, rating, comment } = req.body;

    const review = await reviewModel.create({
      productId,
      name,
      rating,
      comment,
      approved: false,
    });
    console.log("SAVED:", review);

    res.status(201).json({
      success: true,
      review,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

// Show ALL Reviews
export const getAllReviewsController = async (req, res) => {
  try {
    const reviews = await reviewModel
      .find()
      .sort({ createdAt: -1 })
      .populate({
        path: "productId",
        select: "name",
      });

    res.json({ success: true, reviews });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Approve
export const approveReviewController = async (req, res) => {
  try {
    const { id } = req.params;

    const review = await reviewModel.findByIdAndUpdate(
      id,
      { approved: true },
      { new: true },
    );

    res.json({
      success: true,
      message: "Review Approved",
      review,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE
export const updateReviewController = async (req, res) => {
  try {
    const { id } = req.params;
    const { comment, rating } = req.body;

    const review = await reviewModel.findByIdAndUpdate(
      id,
      {
        ...(comment && { comment }),
        ...(rating && { rating }),
      },
      { new: true },
    );

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    res.json({
      success: true,
      message: "Review updated successfully",
      review,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};
