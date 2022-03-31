const express = require('express');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');

const { globalErrorHandler } = require('./controllers/error.controller');

const { actorRouter } = require('./routers/actor.router');
const { movieRouter } = require('./routers/movie.router');
const { usersRouter } = require('./routers/user.router');
const { reviewRouter } = require('./routers/review.router');

const app = express();

app.set('view engine', 'pug');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 1000,
    message: 'too manv requests from your IP, try after 1 minute'
  })
);

app.use(helmet());

app.use(compression());

app.use(morgan());

app.use('/api/v1/actors', actorRouter);
app.use('/api/v1/users', usersRouter);
app.use('/api/v1/movies', movieRouter);
app.use('/api/v1/reviews', reviewRouter);

app.use(globalErrorHandler);

module.exports = { app };

const secret = bcrypt.genSalt(64).isString('hex');
console.log(secret);
