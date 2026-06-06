import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },


    customerEmail: { type: String, default: "" },
    customerName: { type: String, default: "" },
    customerLocation: { type: String, default: "" },
    customerMobile: { type: String, default: "" },
    orderNote: { type: String, default: "" },

    products: [
      {
        productId: String,
        productTitle: String,
        quantity: Number,
        price: Number,
        image: String,
        subTotal: Number,
        playerId: { type: String, default: "" },
        package: { type: String, default: "" },
      },
    ],

    paymentId: String,

    paymentMethod: {
      type: String,
      enum: ["bkash", "nagad", "rocket"],
      default: "",
    },

    paymentNumber: String,

    payment_status: {
      type: String,
      enum: ["pending", "verified", "failed"],
      default: "pending",
    },

    order_status: {
      type: String,
      default: "pending",
    },

    fulfillment_status: {
      type: String,
      enum: ["pending", "processing", "delivered", "failed"],
      default: "pending",
    },

    autoProcessed: {
      type: Boolean,
      default: false,
    },

    autoLog: [
      {
        action: String,
        message: String,
        at: { type: Date, default: Date.now },
      },
    ],

    totalAmt: {
      type: Number,
      default: 0,
    },
    notes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Note",
      },
    ],

    orderNumber: {
      type: Number,
      unique: true,
    }
  },
  { timestamps: true }
);

const orderModel = mongoose.model("order", orderSchema);
export default orderModel;