import express from "express";

import {
  changePasswordController,
  deleteUserController,
  forgotPassword,
  getAllUsersController,
  getUserProfile,
  loginController,
  logoutController,
  registerController,
  resendOtpController,
  updateProfileController,
  updateUserRoleController,
  verifyEmailController,
  verifyForgotPassword,
} from "../controllers/userController.js";

import {
  getHomeSliderImages,
  homeSliderController,
  homeSliderDeleteController,
} from "../controllers/homeSliderController.js";

import { upload } from "../middlewares/multer.js";

import {
  CreatecategoryController,
  DeletecategoryController,
  GetcategoryController,
  UpdatecategoryController,
} from "../controllers/categoryController.js";

import {
  createProductController,
  getProductController,
  getSingleProductController,
  productPhotoController,
  productBgPhotoController,
  deleteProductController,
  updateProductController,
  productFilterController,
  productCountController,
  productListController,
  searchProductController,
  productStatsController,
  togglePublishProduct,
  toggleFeaturedProduct,
  getFeaturedProductsController,
  getRelatedProducts,
  getProductByIdController,
} from "../controllers/productController.js";

import {
  adminDashboardController,
  createOrderController,
  getAdminProductsController,
  getAllOrdersController,
  getProductByCategoryController,
  getSingleOrderController,
  getUserOrdersController,
  OrdersStatusController,
} from "../controllers/orderController.js";

import auth from "../middlewares/auth.js";

import {
  createNoteController,
  deleteNoteController,
  getNotesController,
  getOrderNotesController,
  sendNotesToCustomerController,
  updateNoteController,
} from "../controllers/noteController.js";

import {
  approveReviewController,
  createReviewController,
  getAllReviewsController,
  getReviewsController,
  updateReviewController,
} from "../controllers/reviewController.js";

import isAdmin from "../middlewares/isAdmin.js";

import {
  getEnvSettings,
  saveSMTPSettings,
  testSMTPConnection,
} from "../controllers/mailController.js";

import {
  getConfig,
  saveConfig,
} from "../controllers/tokenController.js";

const router = express.Router();



// AUTH ROUTES (PUBLIC)
router.post("/register", registerController);

router.post("/verifyEmail", verifyEmailController);

router.post("/login", loginController);

router.get("/logout", logoutController);

router.post("/forgot-password", forgotPassword);

router.post(
  "/verify-forgot-password-otp",
  verifyForgotPassword
);

router.post(
  "/forgot-password/change-password",
  changePasswordController
);

router.post("/resend-otp", resendOtpController);



// CATEGORY ROUTES
// PUBLIC
router.get("/category", GetcategoryController);

// ADMIN
router.post(
  "/category",
  auth,
  isAdmin,
  CreatecategoryController
);

router.put(
  "/category/:id",
  auth,
  isAdmin,
  UpdatecategoryController
);

router.delete(
  "/category/:id",
  auth,
  isAdmin,
  DeletecategoryController
);



// PUBLIC PRODUCT ROUTES
router.get("/product", getProductController);

router.get(
  "/product/:category/:slug",
  getSingleProductController
);

router.get(
  "/product/category/:slug",
  getProductByCategoryController
);

router.get(
  "/product/photo/:id",
  productPhotoController
);

router.get(
  "/product/bg-photo/:id",
  productBgPhotoController
);

router.post(
  "/product/filter",
  productFilterController
);

router.get(
  "/product-count",
  productCountController
);

router.get(
  "/product-list/:page",
  productListController
);

router.get(
  "/search/:keyword",
  searchProductController
);

router.get(
  "/product-stats",
  productStatsController
);

router.get(
  "/product/featured/list",
  getFeaturedProductsController
);

router.get(
  "/related/:id",
  getRelatedProducts
);


// ADMIN PRODUCT ROUTES

// SECURE ADMIN PRODUCT LIST
router.get(
  "/admin/products",
  auth,
  isAdmin,
  getAdminProductsController
);

// CREATE PRODUCT
router.post(
  "/product",
  auth,
  isAdmin,
  upload.fields([
    { name: "photo", maxCount: 1 },
    { name: "bgPhoto", maxCount: 1 },
    { name: "packageImage", maxCount: 20 },
  ]),
  createProductController
);

// UPDATE PRODUCT
router.put(
  "/product/:id",
  auth,
  isAdmin,
  upload.fields([
    { name: "photo", maxCount: 1 },
    { name: "bgPhoto", maxCount: 1 },
    { name: "packageImage", maxCount: 20 },
  ]),
  updateProductController
);

router.get(
  "/product/:id",
  auth,
  isAdmin,
  getProductByIdController
);

// DELETE PRODUCT
router.delete(
  "/product/:id",
  auth,
  isAdmin,
  deleteProductController
);

// TOGGLE PUBLISH
router.patch(
  "/product/publish/:id",
  auth,
  isAdmin,
  togglePublishProduct
);

// TOGGLE FEATURED
router.patch(
  "/product/featured/:id",
  auth,
  isAdmin,
  toggleFeaturedProduct
);


// ======================================================
// REVIEW ROUTES
// ======================================================

// PUBLIC
router.get(
  "/reviews/:productId",
  getReviewsController
);

// CUSTOMER
router.post(
  "/reviews",
  auth,
  createReviewController
);

// ADMIN
router.get(
  "/admin/all",
  auth,
  isAdmin,
  getAllReviewsController
);

router.put(
  "/approve/:id",
  auth,
  isAdmin,
  approveReviewController
);

router.put(
  "/review/update/:id",
  auth,
  isAdmin,
  updateReviewController
);


// ======================================================
// USER ROUTES
// ======================================================

router.get(
  "/user",
  auth,
  getUserProfile
);

router.put(
  "/update-profile",
  auth,
  updateProfileController
);

router.put(
  "/change-password",
  auth,
  changePasswordController
);


// ======================================================
// ORDER ROUTES
// ======================================================

// CUSTOMER
router.post(
  "/order/create",
  auth,
  createOrderController
);

router.get(
  "/my-orders",
  auth,
  getUserOrdersController
);

// ADMIN
router.get(
  "/orders",
  auth,
  isAdmin,
  getAllOrdersController
);

router.get(
  "/order/:id",
  getSingleOrderController
);

router.put(
  "/order/status/:id",
  auth,
  isAdmin,
  OrdersStatusController
);




// ======================================================
// ADMIN DASHBOARD
// ======================================================

router.get(
  "/admin",
  auth,
  isAdmin,
  adminDashboardController
);


// ======================================================
// USER MANAGEMENT
// ======================================================

router.get(
  "/users",
  auth,
  isAdmin,
  getAllUsersController
);

router.put(
  "/users/:userId/role",
  auth,
  isAdmin,
  updateUserRoleController
);

router.delete(
  "/users/:userId",
  auth,
  isAdmin,
  deleteUserController
);


// ======================================================
// HOME SLIDER
// ======================================================

// PUBLIC
router.get(
  "/home-slider/images",
  getHomeSliderImages
);

// ADMIN
router.post(
  "/home-slider",
  auth,
  isAdmin,
  upload.array("images", 10),
  homeSliderController
);

router.delete(
  "/home-slider",
  auth,
  isAdmin,
  homeSliderDeleteController
);


// ======================================================
// NOTES
// ======================================================

router.post(
  "/create-notes",
  auth,
  isAdmin,
  createNoteController
);

router.get(
  "/all-notes",
  auth,
  isAdmin,
  getNotesController
);

router.delete(
  "/delete-notes/:id",
  auth,
  isAdmin,
  deleteNoteController
);

router.put(
  "/update-notes/:id",
  auth,
  isAdmin,
  updateNoteController
);

router.get(
  "/order-notes/:orderId",
  auth,
  isAdmin,
  getOrderNotesController
);

router.post(
  "/send-notes-to-customer",
  auth,
  isAdmin,
  sendNotesToCustomerController
);


// ======================================================
// SMTP
// ======================================================

router.post(
  "/smtp/save",
  auth,
  isAdmin,
  saveSMTPSettings
);

router.post(
  "/smtp/test",
  auth,
  isAdmin,
  testSMTPConnection
);

router.get(
  "/smtp/get-env",
  auth,
  isAdmin,
  getEnvSettings
);


// ======================================================
// TOKEN CONFIG
// ======================================================

router.post(
  "/save",
  auth,
  isAdmin,
  saveConfig
);

router.get(
  "/get",
  auth,
  isAdmin,
  getConfig
);

export default router;