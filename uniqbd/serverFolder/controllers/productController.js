import slugify from "slugify";
import ProductModel from "../models/productModel.js";


// CREATE PRODUCT
export const createProductController = async (req, res) => {
  try {
    const {
      name,
      description,
      shortDescription,
      price,
      discountPrice,
      quantity,
      category,
      packageType,
    } = req.body;

    let parsedPackageType = [];
    if (packageType) {
      try {
        parsedPackageType = JSON.parse(packageType);
      } catch (err) {
        parsedPackageType = [];
      }
    }

    const packageImage = req.files?.packageImage?.[0]?.filename || "";

    const product = await ProductModel.create({
      name,
      slug: slugify(name),
      description,
      shortDescription,
      price,
      discountPrice,
      quantity,
      category,
      packageType: parsedPackageType,
      packageImage,
      photo: req.files?.photo?.[0]?.filename,
      bgPhoto: req.files?.bgPhoto?.[0]?.filename,
    });

    res.status(201).send({
      success: true,
      message: "Product created",
      product,
    });
  } catch (error) {
    console.log("CREATE ERROR:", error);
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};

// FILTER PRODUCT
export const productFilterController = async (req, res) => {
  try {
    const { category, priceRange, packageType } = req.body;

    let query = {};

    if (category?.length) query.category = category;
    if (priceRange?.length)
      query.price = { $gte: priceRange[0], $lte: priceRange[1] };
    if (packageType?.length) query.packageType = packageType;

    const products = await ProductModel.find(query);

    res.send({
      success: true,
      products,
    });
  } catch (error) {
    res.status(500).send({ success: false, error });
  }
};

// GET ALL PRODUCTS
export const getProductController = async (req, res) => {
  try {
    const { category } = req.query;

    let query = {};

    // optional category filter
    if (category) query.category = category;

    // ✅ IMPORTANT: default = only published products
    if (req.query.includeUnpublished !== "true") {
      query.isPublished = true;
    }

    const products = await ProductModel.find(query)
      .populate("category")
      .sort({ createdAt: -1 });

    res.send({
      success: true,
      total: products.length,
      products,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      error: error.message,
    });
  }
};

// GET SINGLE PRODUCT
export const getSingleProductController = async (req, res) => {
  try {
    const product = await ProductModel.findOne({
      slug: req.params.slug,
    }).populate("category");

    res.send({
      success: true,
      product,
    });
  } catch (error) {
    res.status(500).send({ success: false, error });
  }
};

// PRODUCT PHOTO
export const productPhotoController = async (req, res) => {
  try {
    const product = await ProductModel.findById(req.params.id);

    res.send({
      success: true,
      photo: `/uploads/${product.photo}`,
    });
  } catch (error) {
    res.status(500).send({ success: false, error });
  }
};

// BG PHOTO
export const productBgPhotoController = async (req, res) => {
  try {
    const product = await ProductModel.findById(req.params.id);

    res.send({
      success: true,
      bgPhoto: `/uploads/${product.bgPhoto}`,
    });
  } catch (error) {
    res.status(500).send({ success: false, error });
  }
};

// DELETE PRODUCT
export const deleteProductController = async (req, res) => {
  try {
    const product = await ProductModel.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).send({
        success: false,
        message: "Product not found",
      });
    }

    res.send({
      success: true,
      message: "Product deleted",
    });
  } catch (error) {
    res.status(500).send({ success: false, error });
  }
};

// UPDATE PRODUCT
export const updateProductController = async (req, res) => {
  try {
    const { name, packageType } = req.body;

    let parsedPackageType = [];
    if (packageType) {
      try {
        parsedPackageType = JSON.parse(packageType);
      } catch (e) {
        parsedPackageType = [];
      }
    }

    const updateData = {
      ...req.body,
      packageType: parsedPackageType,
    };

    if (name) {
      updateData.slug = slugify(name);
    }

    if (req.files?.photo?.[0]?.filename) {
      updateData.photo = req.files.photo[0].filename;
    }

    if (req.files?.bgPhoto?.[0]?.filename) {
      updateData.bgPhoto = req.files.bgPhoto[0].filename;
    }

    const packageImage = req.files?.packageImage?.[0]?.filename;

    if (packageImage) {
      updateData.packageImage = packageImage;
    }

    const updated = await ProductModel.findOneAndUpdate(
      { slug: req.params.id }, 
      updateData,
      { new: true },
    );

    if (!updated) {
      return res.status(404).send({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).send({
      success: true,
      message: "Product updated",
      updated,
    });
  } catch (error) {
    console.error("UPDATE ERROR:", error);
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};

// COUNT PRODUCTS
export const productCountController = async (req, res) => {
  try {
    const total = await ProductModel.countDocuments();

    res.send({
      success: true,
      total,
    });
  } catch (error) {
    res.status(500).send({ success: false, error });
  }
};

// PAGINATION
export const productListController = async (req, res) => {
  try {
    const perPage = 6;
    const page = req.params.page || 1;

    const products = await ProductModel.find()
      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort({ createdAt: -1 });

    res.send({
      success: true,
      products,
    });
  } catch (error) {
    res.status(500).send({ success: false, error });
  }
};

// SEARCH PRODUCT
export const searchProductController = async (req, res) => {
  try {
    const keyword = req.params.keyword;

    const results = await ProductModel.find({
      name: { $regex: keyword, $options: "i" },
    });

    res.send({
      success: true,
      results,
    });
  } catch (error) {
    res.status(500).send({ success: false, error });
  }
};

// PRODUCT STATS INCLUDING PACKAGE
export const productStatsController = async (req, res) => {
  try {
    const totalProducts = await ProductModel.countDocuments();

    const totalStockAgg = await ProductModel.aggregate([
      {
        $group: {
          _id: null,
          totalQty: { $sum: "$quantity" },
        },
      },
    ]);

    const totalStock = totalStockAgg[0]?.totalQty || 0;

    const stockByPackage = await ProductModel.aggregate([
      {
        $group: {
          _id: "$package",
          totalQty: { $sum: "$quantity" },
          count: { $sum: 1 },
        },
      },
    ]);

    res.send({
      success: true,
      totalProducts,
      totalStock,
      stockByPackage,
    });
  } catch (error) {
    res.status(500).send({ success: false, error });
  }
};

// UPDATE PUBLISH STATUS
export const togglePublishProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await ProductModel.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    product.isPublished = !product.isPublished;

    await product.save();

    res.status(200).json({
      success: true,
      message: "Publish status updated",
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const toggleFeaturedProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await ProductModel.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    product.featured = !product.featured;

    await product.save();

    return res.status(200).json({
      success: true,
      message: "Featured status updated",
      product,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getFeaturedProductsController = async (req, res) => {
  try {
    const products = await ProductModel.find({
      isPublished: true,
      featured: true,
    })
      .populate("category")
      .sort({ createdAt: -1 });

    res.send({
      success: true,
      products,
    });
  } catch (error) {
    res.status(500).send({ success: false, error });
  }
};


export const getRelatedProducts = async (req, res) => {
  try {
    const { id } = req.params;


    const product = await ProductModel.findById(id);

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

  
    const relatedProducts = await ProductModel.find({
      category: product.category,
      _id: { $ne: product._id },
    }).limit(6);

    res.json({
      success: true,
      products: relatedProducts,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};