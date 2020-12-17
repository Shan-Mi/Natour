const express = require('express');
// express is a function and with that function calling, app has buntch of methods calling.
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

// 1) global middlewares
// 'tiny' is another params in morgan
// console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// limiter is a middleware function
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000, // 100 request from 1 same ip within 1 hour
  message: 'Too many requests from this IP, please try again in an hour!',
});

app.use('/api', limiter); // specify this route
// if we save here, we will reset limit

app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// mount routers
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
  // const err = new Error(`Can't find ${req.originalUrl} on this server!`);
  // err.status = 'fail';
  // err.statusCode = 404;

  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// express automatically know this is an error handling middleware
app.use(globalErrorHandler);

module.exports = app;

// app is mainly used for middleware declarations

// we can use app.use to use any middleware
