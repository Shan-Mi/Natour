const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const sendEmail = require('../utils/email');

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
    passwordChangedAt: req.body.passwordChangedAt,
    role: req.body.role,
    passwordResetToken: req.body.passwordResetToken,
    passwordResetExpires: req.body.passwordResetExpires,
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

exports.protect = catchAsync(async (req, res, next) => {
  // 1) Getting token, and check if it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  // console.log(token);
  if (!token) {
    return next(
      new AppError('You are not logged in, please login to get access', 401)
    );
  }
  // 2) Verification token,
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  // console.log(decoded);
  // { id: '5fc812a2ea315627edcdbb9d', iat: 1606947861, exp: 1614723861 }
  // 3) Check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError('The user belonging to this token does no longer exist', 401)
    );
  }
  // 4) Check if user changed password after the token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('User recently changed password! Please log in again!', 401)
    );
  }
  // Grant access to protected route
  req.user = currentUser;
  next();
});

// rest parameter syntax
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action!', 403)
      ); //forbidden
    }
    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on POSTed email
  console.log(
    `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/`
  );
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError('There is no user with that email address.', 404));
  }

  // 2) Generate the random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // 3) Send it to user's email
  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/resetPassword/${resetToken}`; // send original token

  const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}. \nIf you did not forget your password, please ignore this email!`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password reset token (valid for 10 min)',
      message,
    });

    res.status(200).json({
      status: 'success',
      message: 'Token sent to your email!',
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false }); // Do the same thing, save to db.

    return next(
      new AppError(
        'There was an error sending the email, please try again later.'
      ),
      500
    );
  }
});

exports.resetPassword = (req, res, next) => {};
