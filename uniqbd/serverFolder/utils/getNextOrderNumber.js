import CounterModel from "../models/counterModel.js";

export const getNextOrderNumber = async () => {
  const counter = await CounterModel.findOneAndUpdate(
    { name: "order" },
    { $inc: { value: 1 } },
    { new: true, upsert: true }
  );

  return `ORD-${counter.value}`;
};