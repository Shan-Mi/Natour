const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour must have a name'], // a validator
    unique: true,
  }, //schema type options, can be different type
  rating: {
    type: Number,
    default: 4.5,
  },
  price: {
    type: Number,
    required: [true, 'A tour must have a price'],
  },
});

// create a model
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
