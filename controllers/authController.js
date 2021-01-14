const crypto = require("crypto");
const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const Email = require("../utils/email");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true, // prevent cors attack
    sameSite: "strict",
    // Secure,
  };

  if (process.env.NODE_ENV === "production") {
    // app.set('trust proxy', 1); // trust first proxy
    cookieOptions.secure = true;
  }

  res.cookie("jwt", token, cookieOptions);

  // remove psw from output
  user.password = undefined;
  // console.log(user);

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
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
  // const url = "http://localhost:8000/me";
  const url = `${req.protocol}://${req.get("host")}/me`;
  console.log(url)
  await new Email(newUser, url).sendWelcome();
  // now we cannot register as an admin
  createSendToken(newUser, 201, res);
});

exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  // 1) check if email and password exist
  if (!email || !password) {
    return next(new AppError("Please provide email and password", 400));
  }

  // 2) check if user exists && password is correct
  const user = await User.findOne({ email }).select("+password");
  // const correct = await user.correctPassword(password, user.password);

  // now if the user doesnot exist, it will not run the correct function
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Increct email or password", 401));
  }

  // 3) If everything is ok, send the json web token to the client
  createSendToken(user, 200, res);
};

// Set-Cookie: flavor=choco; SameSite=None; Secure
exports.logout = (req, res) => {
  // if (navigator.userAgent.indexOf('Firefox') !== -1) {
  //   res.cookie('jwt', 'loggedout', {
  //     expires: new Date(Date.now() + 10 * 1000),
  //     httpOnly: true,
  //     sameSite: 'strict',
  //     // secure: true,
  //   });
  //   console.log('firefox is here');
  // } else {
  res.cookie("jwt", "loggedout", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
    // sameSite: 'strict',
    // secure: true,
  });
  // }
  res.status(200).json({ status: "success" });
};

exports.protect = catchAsync(async (req, res, next) => {
  // 1) Getting token, and check if it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  // console.log(token);
  if (!token) {
    return next(
      new AppError("You are not logged in, please login to get access", 401)
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
      new AppError("The user belonging to this token does no longer exist", 401)
    );
  }
  // 4) Check if user changed password after the token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError("User recently changed password! Please log in again!", 401)
    );
  }
  // Grant access to protected route
  req.user = currentUser;
  res.locals.user = currentUser;
  next();
});

// rest parameter syntax
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You do not have permission to perform this action!", 403)
      ); //forbidden
    }
    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on POSTed email
  console.log(
    `${req.protocol}://${req.get("host")}/api/v1/users/resetPassword/`
  );
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError("There is no user with that email address.", 404));
  }

  // 2) Generate the random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // 3) Send it to user's email
  const resetURL = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/users/resetPassword/${resetToken}`; // send original token

  const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}. \nIf you did not forget your password, please ignore this email!`;

  try {
    // await Email({
    //   email: user.email,
    //   subject: 'Your password reset token (valid for 10 min)',
    //   message,
    // });

    res.status(200).json({
      status: "success",
      message: "Token sent to your email!",
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false }); // Do the same thing, save to db.

    return next(
      new AppError(
        "There was an error sending the email, please try again later."
      ),
      500
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on the token
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: {
      $gt: Date.now(),
    },
  });
  // encrypt token and compare with the encrypt one
  // 2) If token has not expired, and there is user, set the new password
  if (!user) {
    return next(new AppError("Token is invalid or has expired", 400));
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  // 3) Update changedPasswordAt property for the user

  // 4) Log the user in, send JWT to the client
  createSendToken(user, 200, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  // 1) Get user from collection
  const user = await User.findById(req.user.id).select("+password");
  // 2) Check if POSTed current password is correct
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError("Your current password is wrong.", 401));
  }
  // 3) if so, update password
  user.password = req.body.password;
  user.passwordCurrent = req.body.passwordCurrent;
  await user.save();
  // User.findByIdAndUpdate

  // 4) Log user in, send JWT
  createSendToken(user, 200, res);
});

// only for conditional rendering, no errors
exports.isLoggedIn = async (req, res, next) => {
  let token;
  if (req.cookies.jwt) {
    try {
      // 1 verify token
      token = req.cookies.jwt;
      const decoded = await promisify(jwt.verify)(
        token,
        process.env.JWT_SECRET
      );

      // 2) Check if user still exists
      const currentUser = await User.findById(decoded.id);
      if (!currentUser) {
        return next();
      }
      // 3) Check if user changed password after the token was issued
      if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next();
      }
      // There is a logged in user
      // pug will get access to this user
      res.locals.user = currentUser;
      // console.log(res.locals);
      return next();
    } catch (err) {
      return next();
    }
  }
  next();
};
