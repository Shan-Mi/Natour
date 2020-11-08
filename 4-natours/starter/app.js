const fs = require('fs');
const express = require('express');
// express is a function and with that function calling, app has buntch of methods calling.
const app = express();

app.use(express.json());
// express.json() is middleware which is a function that can modify the incoming request data.
// It's called middleware because it stands between.
// in the middle of request and response

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

// now this x is an optional params
// app.get('/api/v1/tours/:id/:x?', (req, res) => {
app.get('/api/v1/tours/:id', (req, res) => {
  const id = Number(req.params.id);
  const tour = tours.find((tour) => tour.id === id);
  if (tour) {
    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: {
        tour,
      },
    });
  } else {
    res.status(404).json({
      status: 'failed',
      message: 'Invalid ID',
    });
  }
});

app.post('/api/v1/tours', (req, res) => {
  // console.log(req.body);
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);
  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour,
        },
      });
    }
  );
  // res.send('done');
});

app.delete('/api/v1/tours/:id', (req, res) => {
  const id = Number(req.params.id);
  const tour = tours.find((tour) => tour.id === id);
  if (!tour) {
    res.status(404).json({
      status: 'failed',
      message: 'Invalid ID',
    });
  }
  res.status(204).json({
    status: 'success',
    data: null,
  });
});

// begin a server
const port = 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
