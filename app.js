const express = require('express');

const { globalErrorHandler } = require('./controllers/error.controller');

const { actorRouter } = require('./routers/actor.router');
const { movieRouter } = require('./routers/movie.router');
const { usersRouter } = require('./routers/user.router');
const { reviewRouter } = require('./routers/review.router');

const app = express();

app.use(express.json());

app.use('/api/v1/actors', actorRouter);
app.use('/api/v1/users', usersRouter);
app.use('/api/v1/movies', movieRouter);
app.use('/api/v1/reviews', reviewRouter);

app.use(globalErrorHandler);

module.exports = { app };
