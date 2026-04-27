import OrderModel from "../models/orderModel.js";
import { getNextOrderNumber } from "../utils/getNextOrderNumber.js";

export const createOrderController = async (req, res) => {
  try {
    const orderNumber = await getNextOrderNumber();

    const newOrder = new OrderModel({
      ...req.body,
      orderNumber,
    });

    await newOrder.save();

    res.status(201).json({
      success: true,
      order: newOrder,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};