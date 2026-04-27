import noteModel from "../models/noteModel.js";
import orderModel from "../models/orderModel.js";

export const createNoteController = async (req, res) => {
  try {
    const { title, text, orderId } = req.body;
    const userId = req.userId;

    if (!title || !text) {
      return res.status(400).json({
        success: false,
        message: "Title and text required",
      });
    }

    const note = await noteModel.create({
      title,
      text,
      userId,
      orderId: orderId || null,
    });

    return res.status(201).json({
      success: true,
      message: "Note created successfully",
      note,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getNotesController = async (req, res) => {
  try {
    const userId = req.userId;

    const notes = await noteModel.find({ userId }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      notes,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getOrderNotesController = async (req, res) => {
  try {
    const orderId = req.params.orderId; // safer

    const notes = await noteModel.find({ orderId }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      notes,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteNoteController = async (req, res) => {
  try {
    const { id } = req.params;

    await noteModel.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Note deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateNoteController = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, text } = req.body;

    if (!title || !text) {
      return res.status(400).json({
        success: false,
        message: "Title and text required",
      });
    }

    const note = await noteModel.findByIdAndUpdate(
      id,
      { title, text },
      { new: true },
    );

    return res.status(200).json({
      success: true,
      message: "Note updated successfully",
      note,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const sendNotesToCustomerController = async (req, res) => {
  try {
    const { orderId, noteIds, customMessage } = req.body;

    if (!orderId || (!noteIds?.length && !customMessage?.trim())) {
      return res.status(400).json({
        success: false,
        message: "Provide noteIds or customMessage",
      });
    }

    let notes = [];
    if (noteIds?.length) {
      notes = await noteModel.find({ _id: { $in: noteIds } });

      await noteModel.updateMany(
        { _id: { $in: noteIds } },
        { isSentToCustomer: true },
      );
    }

    if (customMessage?.trim()) {
      const newNote = await noteModel.create({
        title: "Custom Message",
        text: customMessage,
        orderId,
      });

      notes.push(newNote);
    }
    await orderModel.findByIdAndUpdate(orderId, {
      $addToSet: {
        notes: { $each: notes.map((n) => n._id) },
      },
    });

    return res.status(200).json({
      success: true,
      message: "Notes sent to customer",
      notes,
    });
  } catch (error) {
    console.log("SEND NOTES ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const order = await orderModel.findById(req.params.id).populate({
      path: "notes",
      options: { sort: { createdAt: -1 } },
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
