const { catchAsync } = require('../util/catchAsync');
const { AppError } = require('../util/appError');
const { ref, uploadBytes } = require('firebase/storage');
const { storage } = require('../util/firebase');

const { Movie } = require('../models/movieModel');
const { Actor } = require('../models/actorModel');
const { ActorInMovie } = require('../models/actorInMovieModel');
const { Review } = require('../models/reviewModel');
const { User } = require('../models/usermodel');

exports.getAllMovie = catchAsync(async (req, res, next) => {
  const movies = await Movie.findAll({
    where: { status: 'active' },
    include: [
      { model: Actor },
      {
        model: Review,
        include: [{ model: User, attributes: { exclude: ['password'] } }]
      }
    ]
  });

  res.status(200).json({
    status: 'success',
    data: {
      movies
    }
  });
});

exports.getMovieById = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const movie = await Movie.findOne({
    where: { id, status: 'active' },
    include: [{ model: Actor }, { model: Review }, { model: User }]
  });

  res.status(200).json({
    status: 'success',
    data: {
      movie
    }
  });
});

exports.createMovie = catchAsync(async (req, res, next) => {
  const { title, description, duration, rating, genere, actors } = req.body;

  const imgRef = ref(storage, `imgs/${Date.now()}-${req.file.originalname}`);
  const result = await uploadBytes(imgRef, req.file.buffer);

  const newMovie = await Movie.create({
    title: title,
    description: description,
    duration: duration,
    rating: rating,
    img: result.metadata.fullPath,
    genere: genere
  });

  const actorInMoviePromises = actors.map(async (actorId) => {
    return await ActorInMovie.create({ actorId, movieId: newMovie.id });
  });

  await Promise.all(actorInMoviePromises);

  res.status(201).json({
    status: 'success',
    data: { newMovie }
  });
});

exports.updateMovie = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const data = filterObj(
    req.body,
    'title',
    'description',
    'duration',
    'genere'
  );

  const movie = await Movie.findOne({
    where: { id, status: 'active' }
  });

  await movie.update({ ...data });

  res.status(204).json({ status: 'success' });
});

exports.deleteMovie = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const movie = await Movie.findOne({
    where: { id, status: 'active' }
  });

  await movie.update({ status: 'delete' });

  res.status(204).json({ status: 'success' });
});
