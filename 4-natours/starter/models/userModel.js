const mongoose = require('mongoose');
const validator = require('validator');

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
  },
  passwordConfirm: {
    type: String,
    // required: [true, 'A user must confirm password'],
    validate: {
      validator: function (val) {
        return val === this.password;
        // this only points to current doc on new document creation
      },
      message: 'Password must consist',
    },
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
