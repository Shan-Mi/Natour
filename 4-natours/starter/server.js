const dotenv = require('dotenv');
dotenv.config({ path: './config.env' }); // this config has to become before require app
const app = require('./app');

// console.log(process.env);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

// database configuration, error handling, etc. env viriables
