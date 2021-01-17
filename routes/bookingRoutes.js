const express = require("express");
const {
  getCheckoutSession,
  createBooking,
  getBooking,
  getAllBookings,
  updateBooking,
  deleteBooking,
} = require("../controllers/bookingController");
const { protect, restrictTo } = require("../controllers/authController");

const router = express.Router();
router.use(protect);

// not follow CRUD, get a checkout sesstion
router.post("/checkout-session/:tourId", getCheckoutSession);
// router.get('/')
router.use(restrictTo("admin", "lead-guide"));

router.route("/").get(getAllBookings).post(createBooking);

router.route("/:id").get(getBooking).patch(updateBooking).delete(deleteBooking);

module.exports = router;
