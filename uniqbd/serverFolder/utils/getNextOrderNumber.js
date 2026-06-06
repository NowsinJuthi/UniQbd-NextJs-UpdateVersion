import Counter from "../models/counterModel.js";

const getNextOrderNumber = async () => {
  const counter = await Counter.findOneAndUpdate(
    { name: "order" },
    { $inc: { seq: 1 } },
    {
      upsert: true,
      returnDocument: "after",
    }
  );

  return String(counter.seq).padStart(5, "0");
};

export default getNextOrderNumber;