const express = require('express');

const router = express.Router();
const {
  getOverview,
  getTour,
  getLoginForm,
} = require('../controllers/viewsController');
const { isLoggedIn } = require('../controllers/authController');

router.get('/', isLoggedIn, getOverview);
router.get('/tour/:slug', isLoggedIn, getTour);
router.get('/login', isLoggedIn, getLoginForm);

module.exports = router;
