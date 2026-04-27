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
} from "../controllers/productController.js";
import {
  adminDashboardController,
  createOrderController,
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
import { getConfig, saveConfig } from "../controllers/tokenController.js";

const router = express.Router();

// AUTH (PUBLIC)
router.post("/register", registerController);
router.post("/verifyEmail", verifyEmailController);
router.post("/login", loginController);
router.get("/logout", logoutController);
router.post("/forgot-password", forgotPassword);
router.post("/verify-forgot-password-otp", verifyForgotPassword);
router.post("/forgot-password/change-password", changePasswordController);
router.post("/resend-otp", resendOtpController);
router.get("/category", GetcategoryController);

// PUBLIC PRODUCTS (CUSTOMER)
router.get("/product", getProductController);
router.get("/product/:slug", getSingleProductController);
router.get("/product/category/:slug", getProductByCategoryController);
router.get("/product/photo/:id", productPhotoController);
router.get("/product/bg-photo/:id", productBgPhotoController);

router.post("/product/filter", productFilterController);
router.get("/product-count", productCountController);
router.get("/product-list/:page", productListController);
router.get("/search/:keyword", searchProductController);
router.get("/product-stats", productStatsController);

// PUBLIC REVIEWS (READ ONLY)
router.get("/reviews/:productId", getReviewsController);

//  CUSTOMER (LOGIN REQUIRED)
// USER PROFILE
router.get("/user", auth, getUserProfile);
router.put("/update-profile", auth, updateProfileController);
router.put("/change-password", auth, changePasswordController);

// ORDERS (CUSTOMER)
router.post("/order/create", auth, createOrderController);
router.get("/my-orders", auth, getUserOrdersController);

// REVIEWS (CUSTOMER)
router.post("/reviews", auth, createReviewController);

// ADMIN ROUTES (ADMIN ONLY)
// DASHBOARD
router.get("/admin", auth, isAdmin, adminDashboardController);

// USERS
router.get("/users", auth, isAdmin, getAllUsersController);
router.put("/users/:userId/role", auth, isAdmin, updateUserRoleController);
router.delete("/users/:userId", auth, isAdmin, deleteUserController);

// PRODUCTS
router.post(
  "/product",
  upload.fields([
    { name: "photo", maxCount: 1 },
    { name: "bgPhoto", maxCount: 1 },
    { name: "packageImage", maxCount: 20 },
  ]),

  createProductController,
);
router.put(
  "/product/:id",
  upload.fields([
    { name: "photo", maxCount: 1 },
    { name: "bgPhoto", maxCount: 1 },
    { name: "packageImage", maxCount: 20 },
  ]),

  updateProductController,
);
router.delete("/product/:id", auth, isAdmin, deleteProductController);

// CATEGORY
router.post("/category", auth, isAdmin, CreatecategoryController);
router.delete("/category/:id", auth, isAdmin, DeletecategoryController);
router.put("/category/:id", auth, isAdmin, UpdatecategoryController);

// ORDERS
router.get("/orders", auth, isAdmin, getAllOrdersController);
router.get("/order/:id", auth, isAdmin, getSingleOrderController);
router.put("/order/status/:id", auth, isAdmin, OrdersStatusController);

// HOME SLIDER
router.post(
  "/home-slider",
  upload.array("images", 10),
  auth,
  isAdmin,
  homeSliderController,
);
router.get("/home-slider/images", getHomeSliderImages);
router.delete("/home-slider", auth, isAdmin, homeSliderDeleteController);

// REVIEWS
router.get("/admin/all", auth, isAdmin, getAllReviewsController);
router.put("/approve/:id", auth, isAdmin, approveReviewController);
router.put("/review/update/:id", auth, isAdmin, updateReviewController);

// NOTES
router.post("/create-notes", auth, isAdmin, createNoteController);
router.get("/all-notes", auth, isAdmin, getNotesController);
router.delete("/delete-notes/:id", auth, isAdmin, deleteNoteController);
router.put("/update-notes/:id", auth, isAdmin, updateNoteController);
router.get("/order-notes/:orderId", auth, isAdmin, getOrderNotesController);
router.post(
  "/send-notes-to-customer",
  auth,
  isAdmin,
  sendNotesToCustomerController,
);

// SMTP-CONNECTION
router.post("/smtp/save", saveSMTPSettings);
router.post("/smtp/test", testSMTPConnection);
router.get("/smtp/get-env", getEnvSettings);

//TOKEN-CONFIG
router.post("/save", saveConfig);
router.get("/get", getConfig);

router.patch("/product/publish/:id", togglePublishProduct);
router.patch("/product/featured/:id", toggleFeaturedProduct);
router.get("/product/featured/list", getFeaturedProductsController);


router.get("/related/:id", getRelatedProducts);
export default router;
