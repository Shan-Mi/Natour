const fs = require('fs');
const express = require('express');
// express is a function and with that function calling, app has buntch of methods calling.
const app = express();

// // get method, on url '/', get the res
// app.get('/', (req, res) => {
//   // we can use 200 or OK
//   res.status(200).json({ message: 'Hello from the server', app: 'Natours' });
// });

// app.post('/', (req, res) => {
//   res.send('You can post to this endpoint...');
// });

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

// route handler
app.get('/api/v1/tours', (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      tours,
    },
  });
});

// begin a server
const port = 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
