const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
// name, email, photo (string), password, passwordConfirm
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A user must have a name'], // a validator
  }, //schema type options, can be different type
  email: {
    type: String,
    required: [true, 'A user must have an email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  photo: {
    type: String,
  },
  password: {
    type: String,
    required: [true, 'A user must have a password'],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    // required: [true, 'A user must confirm password'],
    // this works only for SAVE
    validate: {
      validator: function (val) {
        return val === this.password;
        // this only points to current doc on new document creation
      },
      message: 'Password must consist',
    },
    select: false,
  },
  passwordChangedAt: { type: Date },
});

// between receiving data and store it into the db
// we have many methods on each document (each user)
// only run this function only if password was actually modified
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  // to hash password, becrypt
  // async version -> hash() -> return a promise
  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);
  // Delete passwordConfirm field
  this.passwordConfirm = undefined;
  next();
});

// instance method, userPassword is hashed, candidatePassword is not hashed
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimestamp;
  }

  // False means NOT changed
  return false;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
