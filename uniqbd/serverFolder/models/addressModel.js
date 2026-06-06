import mongoose from "mongoose";

const addressSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  mobile: {
    type: Number,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  note: {
    type: Number,
    default: "",
  },

  payNumber: {
    type: Number,
    required: true,
  },
  payTrans: {
    type: Number,
    required: true,
  },
  userId:{
    type: String,
    default: true
  }
},{timestamps:true}
);

const addressModel = mongoose.model('address', addressSchema)

export default addressModel;
