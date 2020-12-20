const express = require('express');
const {
  aliasTopTours,
  getAllTours,
  getTourStats,
  getMonthlyPlan,
  postTour,
  getTour,
  updateTour,
  deleteTour,
} = require('../controllers/tourController');
const { protect, restrictTo } = require('../controllers/authController');
const reviewRouter = require('./reviewRoutes');

const router = express.Router();

// router.param('id', checkID);

// router.route('/')(checkBody)
// Create a checkBody middleware
// Check if body contains the name and price property
// If not, send back 400 (bad request)

// we use middleware first, to do the query thing
router.route('/top-5-cheap').get(aliasTopTours, getAllTours);

router.route('/tour-stats').get(getTourStats);
router
  .route('/monthly-plan/:year')
  .get(protect, restrictTo('admin', 'lead-guide', 'guide'), getMonthlyPlan);

// all users should get all tours / tour without authentication
router
  .route('/')
  .get(getAllTours)
  .post(protect, restrictTo('admin', 'lead-guide'), postTour);

router
  .route('/:id')
  .get(getTour)
  .patch(protect, restrictTo('admin', 'lead-guide'), updateTour)
  .delete(protect, restrictTo('admin', 'lead-guide'), deleteTour);

// router is middleware, we can use .use on it, mounting a router
router.use('/:tourId/reviews', reviewRouter);

module.exports = router;
// restrictTo('admin', 'lead-guide'),
