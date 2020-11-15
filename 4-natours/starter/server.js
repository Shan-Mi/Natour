const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' }); // this config has to become before require app
const app = require('./app');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

// options to handle with deprecation warnings
// this connect will return a promise
mongoose
  // .connect(process.env.DATABASE_LOCAL, { // connect to local db
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log('DB connection successful!'));
// error handling to be added later

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

// testTour is an instance of Tour model, with couple of methods on it
const testTour = new Tour({
  name: 'The Park Camper',
  price: 997,
});

testTour
  .save() // save it in the database
  .then((doc) => {
    console.log(doc);
  })
  .catch((err) => {
    console.log('ERROR 👻👺: ', err);
  });

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

// database configuration, error handling, etc. env viriables
