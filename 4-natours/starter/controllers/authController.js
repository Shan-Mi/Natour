const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });
  // now we cannot register as an admin
  const token = signToken(newUser._id);
  // payload: id: newUser._id
  // header is created automatically
  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: newUser,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  // 1) check if email and password exist
  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400));
  }

  // 2) check if user exists && password is correct
  const user = await User.findOne({ email }).select('+password');
  // const correct = await user.correctPassword(password, user.password);

  // now if the user doesnot exist, it will not run the correct function
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Increct email or password', 401));
  }
  // console.log(user);

  // 3) If everything is ok, send the json web token to the client
  const token = signToken(user._id);
  res.status(200).json({
    status: 'success',
    token,
  });
});
