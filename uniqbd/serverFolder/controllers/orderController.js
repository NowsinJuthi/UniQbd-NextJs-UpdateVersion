import sendEmailFun from "../config/sendEamil.js";
import orderModel from "../models/orderModel.js";
import userModel from "../models/usersModel.js";
import categoryModel from "../models/categoryModel.js";
import productModel from "../models/productModel.js";
import { io } from "../index.js";

//  CREATE ORDER CONTROLLER (REAL-TIME ADDED)
export const createOrderController = async (req, res) => {
  try {
    const userId = req.userId;

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

    // 🔥 DEBUG (safe logging)
    console.log("BODY EMAIL:", customerEmail);
    console.log("USERID:", userId);

    // ❌ REMOVE COOKIE DEBUG IN PRODUCTION (keep only for testing)
    // console.log("COOKIES:", req.cookies);

    console.log("FULL REQ BODY:", req.body);

    // 🚨 VALIDATION FIX
    if (!products || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({
        message: "No products in order",
        success: false,
      });
    }

    // 🚨 SAFE EMAIL FALLBACK
    const email = customerEmail?.trim() || "";

    const newOrder = new orderModel({
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
      })),

      paymentId: paymentId || "",
      paymentMethod: paymentMethod || "",
      paymentNumber: paymentNumber || "",
      payment_status: payment_status || "pending",
      order_status: order_status || "pending",
      totalAmt: totalAmt || 0,
    });

    const savedOrder = await newOrder.save();

    // 🔥 REAL-TIME EVENT
    io.emit("new-order", {
      type: "NEW_ORDER",
      message: "🛒 New Order Received",
      order: savedOrder,
    });

    // 📧 EMAIL SEND FIX (ONLY IF VALID EMAIL)
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
            <p>Total: ${totalAmt || 0} TK</p>
          </div>
        `,
      });
    } else {
      console.log("⚠️ No email provided, skipping email send");
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
/* =========================================================
   GET ALL ORDERS
========================================================= */
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

/* =========================================================
   GET USER ORDERS
========================================================= */
export const getUserOrdersController = async (req, res) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authorized",
      });
    }

    const orders = await orderModel.find({ userId }).sort({ createdAt: -1 });

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

/* =========================================================
   ORDER STATUS UPDATE (REAL-TIME ADDED)
========================================================= */

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

    // UPDATE STATUS
    const newStatus = String(order_status).toLowerCase();
    order.order_status = newStatus;
    await order.save();

    console.log("Updated status:", newStatus);

    /* =====================================================
       🔥 REAL-TIME SOCKET UPDATE
    ===================================================== */
    io.emit("order-status-updated", {
      type: "STATUS_UPDATE",
      message: "Order status updated",
      orderId: order._id,
      status: newStatus,
    });

    /* =====================================================
       📧 EMAIL LOGIC (FIXED)
       - email comes from DB (NOT frontend)
    ===================================================== */

    const email = order.customerEmail; // ✅ FIXED
    const customerName = order.customerName;
    const totalAmt = order.totalAmt;

    console.log("EMAIL FROM DB:", email);

    // ❌ CANCEL EMAIL
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

/* =========================================================
   SINGLE ORDER
========================================================= */
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

/* =========================================================
   ADMIN DASHBOARD
========================================================= */
export const adminDashboardController = async (req, res) => {
  try {
    const totalOrders = await orderModel.countDocuments();
    const totalCustomers = await userModel.countDocuments();

    const revenueResult = await orderModel.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: "$totalAmt" },
        },
      },
    ]);

    return res.json({
      totalOrders,
      totalCustomers,
      revenue: revenueResult[0]?.total || 0,
    });
  } catch (error) {
    console.error("ADMIN DASHBOARD ERROR:", error);
    return res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

/* =========================================================
   AUTH CHECK
========================================================= */
export const requireLogin = (req, res, next) => {
  if (!req.userId) {
    return res.status(401).json({ message: "Login required" });
  }
  next();
};

// GET PRODUCTS (with optional category query)
export const getProductController = async (req, res) => {
  try {
    const { category } = req.query;

    let filter = {};

    if (category) {
      console.log("CATEGORY QUERY:", category);

      const cat = await categoryModel.findOne({
        name: { $regex: new RegExp(`^${category}$`, "i") }
      });

      console.log("FOUND CATEGORY:", cat);

      if (!cat) {
        return res.status(200).json({
          success: true,
          data: []
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
    console.log("PRODUCT ERROR FULL:", error);
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
      name: { $regex: new RegExp(`^${slug}$`, "i") },
    });

    if (!cat) {
      return res.status(200).json({
        success: true,
        data: [],
      });
    }

    const products = await productModel
      .find({ category: cat._id })
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