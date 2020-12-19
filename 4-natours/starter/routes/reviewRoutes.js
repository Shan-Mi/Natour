const express = require('express');
const {
  getAllReviews,
  deleteReview,
  updateReview,
  createReview,
  setTourUserIds,
} = require('../controllers/reviewController');
const { protect, restrictTo } = require('../controllers/authController');

// merge
// each router has only access to their own params
// but here we want to get access to uplevel router's params
const router = express.Router({ mergeParams: true });

// POST /tour/:tourId/reviews/
// GET /tour/:tourId/reviews/:userId
// POST /reviews/

router
  .route('/') // since it is nested, now the base actually is /tour/:tourId/reviews/
  .get(getAllReviews)
  .post(protect, restrictTo('user'), setTourUserIds, createReview);

router.route('/:id').patch(updateReview).delete(deleteReview);
module.exports = router;
