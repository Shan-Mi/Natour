const dotenv = require('dotenv');
const app = require('./app');

dotenv.config({ path: './config.env' });

const port = 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

// database configuration, error handling, etc. env viriables
