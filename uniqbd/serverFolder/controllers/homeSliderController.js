import homeSliderModel from "../models/homeSliderModel.js";
import fs from "fs";
import { uploadDir } from "../config/uploadPath.js";

export async function homeSliderController(req, res) {
  try {
    console.log("Files received:", req.files);

    const images = req.files;
    if (!images || images.length === 0) {
      console.log("No images uploaded");
      return res.status(400).json({ success: false, message: "No images uploaded" });
    }

    const paths = images.map(img => "/uploads/" + img.filename);
    console.log("Mapped paths for DB:", paths);


    const sliderDoc = new homeSliderModel({ images: paths });
    const savedDoc = await sliderDoc.save();

    console.log("Document saved:", savedDoc);

    res.status(200).json({
      success: true,
      message: "Images uploaded successfully",
      images: paths,
    });
  } catch (err) {
    console.error("Error saving HomeSlider:", err);
    res.status(500).json({ success: false, message: err.message });
  }
}

export async function getHomeSliderImages(req, res) {
  try {
    const sliders = await homeSliderModel.find().sort({ createdAt: -1 });

    const images = sliders.flatMap(slider => slider.images);

    const imageNames = images.map(img => img.split("/").pop());

    console.log("All Images Path:", images);
    console.log("Image Names:", imageNames);

    res.status(200).json({
      success: true,
      data: images,
      names: imageNames,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
}

export async function homeSliderDeleteController(req, res) {
  try {
    const { path: imgPath } = req.body;

    if (!imgPath) {
      return res.status(400).json({
        success: false,
        message: "Image path required",
      });
    }

    const filename = imgPath.split("/").pop();
    const filePath = path.join(uploadDir, filename);

    // delete file
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // remove from DB
    await homeSliderModel.updateMany(
      {},
      { $pull: { images: imgPath } }
    );

    res.json({
      success: true,
      message: "Deleted successfully",
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}