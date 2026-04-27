import mongoose from "mongoose";

const categoryShema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
 
},{timestamps:true});

const CategoryModel = mongoose.model('Category', categoryShema)

export default CategoryModel;
