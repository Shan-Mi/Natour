const express = require("express");

const router = express.Router();
const {
  getOverview,
  getTour,
  getLoginForm,
  getAccount,
  updateUserData,
  getMytours,
} = require("../controllers/viewsController");
const { isLoggedIn, protect } = require("../controllers/authController");
const { createBookingCheckout } = require("../controllers/bookingController");

router.get("/", createBookingCheckout, isLoggedIn, getOverview);
router.get("/tour/:slug", isLoggedIn, getTour);
router.get("/login", isLoggedIn, getLoginForm);
router.get("/me", protect, getAccount);
router.get("/my-tours", protect, getMytours);

router.post("/submit-user-data", protect, updateUserData);

module.exports = router;
