import path from "path";
import fs from "fs";
import CategoryModel from "../models/categoryModel.js";

const uploadDir = path.join(process.cwd(), "serverFolder/middleware/uploads");



export async function CreatecategoryController(req, res) {
  try {

    if (!req.body.name) {
      return res.status(400).json({
        message: "Category name is required",
        error: true,
        success: false,
      });
    }

    let category = new CategoryModel({
      name: req.body.name
    });

    category = await category.save();

    return res.status(200).json({
      message: "Category created successfully",
      error: false,
      success: true,
      category,
    });

  } catch (err) {

    return res.status(500).json({
      message: err.message || err,
      error: true,
      success: false,
    });

  }
}


export async function GetcategoryController(req, res) {
  try {

    const categories = await CategoryModel.find();

    return res.status(200).json({
      error:false,
      success:true,
      categories
    });

  } catch (err) {
    return res.status(500).json({
      message: err.message || err,
      error: true,
      success: false,
    });
  }
}


export async function UpdatecategoryController(req, res) {
  try {

    const { id } = req.params;

    let category = await CategoryModel.findById(id);

    if (!category) {
      return res.status(404).json({
        message: "Category not found",
        error: true,
        success: false,
      });
    }


    if (req.body.name) {
      category.name = req.body.name;
    }


    if (req.file) {


      if (category.images) {
        const oldPath = path.join(uploadDir, path.basename(category.images));

        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }

      category.images = `/uploads/${req.file.filename}`;
    }

    await category.save();

    return res.status(200).json({
      message: "Category updated successfully",
      error:false,
      success:true,
      category
    });

  } catch (err) {
    return res.status(500).json({
      message: err.message || err,
      error: true,
      success: false,
    });
  }
}


export async function DeletecategoryController(req, res) {
  try {

    const { id } = req.params;

    const category = await CategoryModel.findById(id);

    if (!category) {
      return res.status(404).json({
        message: "Category not found",
        error:true,
        success:false,
      });
    }


    if (category.images) {

      const filePath = path.join(uploadDir, path.basename(category.images));

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await CategoryModel.findByIdAndDelete(id);

    return res.status(200).json({
      message: "Category deleted successfully",
      error:false,
      success:true,
    });

  } catch (err) {
    return res.status(500).json({
      message: err.message || err,
      error: true,
      success: false,
    });
  }
}


export async function RemovecategoryImageController(req, res) {
  try {

    const { id } = req.params;

    const category = await CategoryModel.findById(id);

    if (!category) {
      return res.status(404).json({
        message: "Category not found",
        error:true,
        success:false,
      });
    }

    if (category.images) {

      const filePath = path.join(uploadDir, path.basename(category.images));

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      category.images = "";
      await category.save();
    }

    return res.status(200).json({
      message: "Category image removed",
      error:false,
      success:true,
      category
    });

  } catch (err) {
    return res.status(500).json({
      message: err.message || err,
      error: true,
      success: false,
    });
  }
}