const fs = require('fs');
const express = require('express');
// express is a function and with that function calling, app has buntch of methods calling.
const app = express();

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

// route handler
app.get('/api/v1/tours', (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
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
