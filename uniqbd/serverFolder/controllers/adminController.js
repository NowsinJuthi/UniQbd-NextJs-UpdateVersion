import userModel from "../models/usersModel.js";
import productModel from "../models/productModel.js";
import orderModel from "../models/orderModel.js";
import reviewModel from "../models/reviewModel.js";

export const adminDashboardController = async (req, res) => {
  try {

    const totalUsers = await userModel.countDocuments();
    const totalProducts = await productModel.countDocuments();
    const totalOrders = await orderModel.countDocuments();
    const totalReviews = await reviewModel.countDocuments();

    const totalRevenueAgg = await orderModel.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalAmt" },
        },
      },
    ]);

    const totalRevenue = totalRevenueAgg[0]?.totalRevenue || 0;


    const recentOrders = await orderModel
      .find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("userId", "name email");


    const lowStockProducts = await productModel
      .find({ stock: { $lte: 5 } })
      .limit(5);


    return res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalProducts,
        totalOrders,
        totalReviews,
        totalRevenue,
        recentOrders,
        lowStockProducts,
      },
    });
  } catch (error) {
    console.error("ADMIN DASHBOARD ERROR:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to load admin dashboard",
    });
  }
};