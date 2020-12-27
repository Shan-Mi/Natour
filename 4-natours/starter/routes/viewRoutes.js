const express = require('express');

const router = express.Router();
const {
  getOverview,
  getTour,
  getLoginForm,
  getAccount,
} = require('../controllers/viewsController');
const { isLoggedIn, protect } = require('../controllers/authController');

router.get('/', isLoggedIn, getOverview);
router.get('/tour/:slug', isLoggedIn, getTour);
router.get('/login', isLoggedIn, getLoginForm);
router.get('/me', protect, getAccount);

module.exports = router;
