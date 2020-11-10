const express = require('express');
// express is a function and with that function calling, app has buntch of methods calling.
const morgan = require('morgan');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

// 1) middlewares
// 'tiny' is another params in morgan
app.use(morgan('dev'));
app.use(express.json());

app.use((req, res, next) => {
  console.log('🌺 Hello from the middleware❗');
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// mount routers
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

const port = 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
