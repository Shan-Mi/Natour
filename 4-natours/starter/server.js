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

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

// database configuration, error handling, etc. env viriables
