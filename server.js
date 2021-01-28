const mongoose = require("mongoose");

const dotenv = require("dotenv");

dotenv.config({ path: "./config.env" }); // this config has to become before require app
process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT REJECTION!!! 👺 shutting down.");
  console.log(err.name, err.message);
  process.exit(1);
});

const app = require("./app");

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
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
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB connection successful🥰"));

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

// database configuration, error handling, etc. env viriables
process.on("unhandledRejection", (err) => {
  server.close(() => {
    process.exit(1);
  });
});
