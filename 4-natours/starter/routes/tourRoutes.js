const express = require('express');
const tourController = require('../controllers/tourController');

const router = express.Router();

// router.param('id', tourController.checkID);

// router.route('/')(tourController.checkBody)
// Create a checkBody middleware
// Check if body contains the name and price property
// If not, send back 400 (bad request)

router.route('/').get(tourController.getAllTours).post(tourController.postTour);

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;
