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
      default: "pending",
    },

    order_status: {
      type: String,
      default: "pending",
    },

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
  },
  { timestamps: true }
);

const orderModel = mongoose.model("order", orderSchema);
export default orderModel;