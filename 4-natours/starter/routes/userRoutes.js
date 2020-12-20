const express = require('express');
const {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  updateMe,
  deleteMe,
  getMe,
} = require('../controllers/userController');

const {
  signup,
  login,
  protect,
  forgotPassword,
  resetPassword,
  updatePassword,
} = require('../controllers/authController');

const router = express.Router();

router.patch('/updateMyPassword', protect, updatePassword);

// by getMe, we get current user's id, then pass it to req.params.id, then reuse getUser
router.get('/me', protect, getMe, getUser);
router.patch('/updateMe', protect, updateMe);
router.patch('/deleteMe', protect, deleteMe);

router.post('/signup', signup);
router.post('/login', login);
router.post('/forgotPassword', forgotPassword);
router.patch('/resetPassword/:token', resetPassword);

router.route('/').get(getAllUsers).post(createUser);

router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
