const express = require("express");
const {
  getAllReviews,
  deleteReview,
  updateReview,
  getReview,
  createReview,
  setTourUserIds,
} = require("../controllers/reviewController");
const { protect, restrictTo } = require("../controllers/authController");

// merge
// each router has only access to their own params
// but here we want to get access to uplevel router's params
const router = express.Router({ mergeParams: true });

// POST /tour/:tourId/reviews/
// GET /tour/:tourId/reviews/:userId
// POST /reviews/

router.use(protect);

router
  .route("/") // since it is nested, now the base actually is /tour/:tourId/reviews/
  .get(getAllReviews)
  .post(restrictTo("user"), setTourUserIds, createReview);

router
  .route("/:id")
  .get(getReview)
  .patch(restrictTo("user", "admin"), updateReview) // only users and admin can edit and delete reviews
  .delete(restrictTo("user", "admin"), deleteReview);

module.exports = router;
