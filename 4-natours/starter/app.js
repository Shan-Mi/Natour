const path = require('path');
const express = require('express');
// express is a function and with that function calling, app has buntch of methods calling.
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
// path, native built-in module, __dirname is the root level

// 1) global middlewares
// Serving static files
app.use(express.static(path.join(__dirname, 'public')));
// 'tiny' is another params in morgan
// console.log(process.env.NODE_ENV);

// Set security HTTP headers
app.use(helmet()); // use helmet early, in the beginning

// Development logging
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

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' })); // if body is bigger than 10kb, will not be accepted

// Data sanitization against noSQL query injection (mongodb query)
app.use(mongoSanitize());

// Data sanitization against XSS (html code)
app.use(xss());

// prevent parameter polotion, accept the last one.
// for these fields on whitelist, they will not be affected
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  })
);

// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// render frontend page
app.get('/', (req, res) => {
  res.status(200).render('base', {
    tour: 'The Forest Hiker',
    user: 'Shan',
  });
});

// mount routers
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

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
