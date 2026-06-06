import sendEmailFun from "../config/sendEamil.js";
import orderModel from "../models/orderModel.js";
import userModel from "../models/usersModel.js";
import categoryModel from "../models/categoryModel.js";
import productModel from "../models/productModel.js";
import { io } from "../index.js";
import reviewModel from "../models/reviewModel.js";
import getNextOrderNumber from "../utils/getNextOrderNumber.js";



//  CREATE ORDER CONTROLLER (REAL-TIME ADDED)
export const createOrderController = async (req, res) => {
  try {
    const userId = req.userId || null;

    const {
      products,
      paymentId,
      payment_status,
      order_status,
      totalAmt,
      paymentMethod,
      paymentNumber,
      customerEmail,
      customerName,
      customerLocation,
      customerMobile,
      orderNote,
    } = req.body;

    console.log("BODY EMAIL:", customerEmail);
    console.log("USERID:", userId);

    if (!products || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No products in order",
      });
    }

    if (paymentId?.trim()) {
      const duplicate = await checkDuplicateTransaction(paymentId);
      if (duplicate) {
        return res.status(400).json({
          success: false,
          message: "This transaction ID was already used for another order",
        });
      }
    }

    const email = customerEmail?.trim() || "";

    const orderNumber = await getNextOrderNumber();

    const newOrder = new orderModel({
      orderNumber, 
      userId,

      customerEmail: email,
      customerName: customerName || "",
      customerLocation: customerLocation || "",
      customerMobile: customerMobile || "",
      orderNote: orderNote || "",

      products: products.map((item) => ({
        productId: item.id,
        productTitle: item.name,
        quantity: item.quantity,
        price: item.price,
        image: item.img,
        subTotal: item.price * item.quantity,
        playerId: item.playerId || "",
        package: item.package || "",
      })),

      paymentId: paymentId || "",
      paymentMethod: paymentMethod || "",
      paymentNumber: paymentNumber || "",
      payment_status: payment_status || "pending",
      order_status: order_status || "pending",
      totalAmt: totalAmt || 0,
    });

    let savedOrder = await newOrder.save();

    savedOrder = await processNewOrder(savedOrder);

    io.emit("new-order", {
      type: "NEW_ORDER",
      message: "🛒 New Order Received",
      order: savedOrder,
      autoProcessed: savedOrder.autoProcessed,
    });

    if (email) {
      await sendEmailFun({
        sendTo: email,
        subject: "Order Confirmed - UniQbd",
        text: "Order placed",
        html: `
          <div>
            <h2>🎉 Order Confirmed</h2>
            <p>Hi ${customerName || "Customer"}</p>
            <p>Your order is received.</p>
            <p><b>Order No:</b> ${orderNumber}</p>
            <p><b>Total:</b> ${totalAmt || 0} TK</p>
          </div>
        `,
      });
    }

    return res.status(201).json({
      success: true,
      order: savedOrder,
    });

  } catch (error) {
    console.log("ORDER CREATE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



export const getAllOrdersController = async (req, res) => {
  try {
    const orders = await orderModel
      .find()
      .populate("notes")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


export const getUserOrdersController = async (req, res) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authorized",
      });
    }

    const orders = await orderModel
      .find({ userId })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      orders,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


export const OrdersStatusController = async (req, res) => {
  try {
    const { order_status } = req.body;

    console.log("Incoming status:", order_status);

    if (!order_status) {
      return res.status(400).json({
        success: false,
        message: "Order status is required",
      });
    }

    // FIND ORDER
    const order = await orderModel.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const newStatus = String(order_status).toLowerCase();
    order.order_status = newStatus;

    if (newStatus === "completed") {
      order.fulfillment_status = "delivered";
    } else if (newStatus === "cancelled" || newStatus === "deleted") {
      order.fulfillment_status = "failed";
    }

    await order.save();

    console.log("Updated status:", newStatus);


    io.emit("order-status-updated", {
      type: "STATUS_UPDATE",
      message: "Order status updated",
      orderId: order._id,
      status: newStatus,
    });

    const email = order.customerEmail;
    const customerName = order.customerName;
    const totalAmt = order.totalAmt;

    console.log("EMAIL FROM DB:", email);


    if (newStatus === "cancelled" && email) {
      await sendEmailFun({
        sendTo: email,
        subject: "❌ Order Cancelled",
        text: "Cancelled",
        html: `
          <div>
            <h2>❌ Order Cancelled</h2>
            <p>Hi ${customerName}</p>
            <p>Your order has been cancelled.</p>
          </div>
        `,
      });
    }

    // 🎉 COMPLETED EMAIL
    if (newStatus === "completed" && email) {
      await sendEmailFun({
        sendTo: email,
        subject: "🎉 Order Completed",
        text: "Completed",
        html: `
          <div>
            <h2>🎉 Order Completed</h2>
            <p>Hi ${customerName}</p>
            <p>Your order is completed successfully.</p>
            <p><b>Total:</b> ${totalAmt} TK</p>
          </div>
        `,
      });
    }

    return res.json({
      success: true,
      message: "Order status updated successfully",
      order,
    });
  } catch (error) {
    console.log("STATUS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getSingleOrderController = async (req, res) => {
  try {
    const order = await orderModel.findById(req.params.id).populate("notes");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.json({
      success: true,
      order,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const adminDashboardController = async (req, res) => {
  try {
    console.log(orderModel.schema.paths);
    // ================= TOTAL COUNTS =================
    const totalUsers = await userModel.countDocuments();
    const totalProducts = await productModel.countDocuments();
    const totalOrders = await orderModel.countDocuments();
    const totalReviews = await reviewModel.countDocuments();

    // ================= ORDERS STATS =================
    const totalRevenueAgg = await orderModel.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalAmount" },
        },
      },
    ]);

    const totalRevenue = totalRevenueAgg[0]?.totalRevenue || 0;

    // ================= RECENT ORDERS =================
    const recentOrders = await orderModel
      .find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("userId", "name email")

    // ================= LOW STOCK PRODUCTS (optional) =================
    const lowStockProducts = await productModel
      .find({ stock: { $lte: 5 } })
      .limit(5);

    // ================= RESPONSE =================
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
export const getPublicProductsController = async (req, res) => {
  try {

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 12;

    const skip = (page - 1) * limit;

    const products = await productModel
      .find({ isPublished: true })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.status(200).send({
      success: true,
      products,
    });

  } catch (error) {
    console.log(error);

    res.status(500).send({
      success: false,
      message: "Error getting products",
    });
  }
};
export const requireLogin = (req, res, next) => {
  if (!req.userId) {
    return res.status(401).json({ message: "Login required" });
  }
  next();
};
export const getProductController = async (req, res) => {
  try {
    const { category } = req.query;

    // ONLY published products
    let filter = {
      isPublished: true,
    };

    // Category filter
    if (category) {

      const cat = await categoryModel.findOne({
        name: {
          $regex: new RegExp(`^${category}$`, "i"),
        },
      });

      if (!cat) {
        return res.status(200).json({
          success: true,
          data: [],
        });
      }

      filter.category = cat._id;
    }

    const products = await productModel
      .find(filter)
      .populate("category")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: products,
    });

  } catch (error) {

    console.log("PRODUCT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const getProductByCategoryController = async (req, res) => {
  try {

    const { slug } = req.params;

    const cat = await categoryModel.findOne({
      name: {
        $regex: new RegExp(`^${slug}$`, "i"),
      },
    });

    if (!cat) {
      return res.status(200).json({
        success: true,
        data: [],
      });
    }

    const products = await productModel
      .find({
        category: cat._id,
        isPublished: true,
      })
      .populate("category");

    return res.status(200).json({
      success: true,
      data: products,
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const getAdminProductsController = async (req, res) => {
  try {

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 12;

    const skip = (page - 1) * limit;

    const products = await productModel
      .find({})
      .populate("category")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return res.status(200).json({
      success: true,
      products,
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


