const { catchAsync } = require('../util/catchAsync');
const { Movie } = require('../models/movieModel');
const { AppError } = require('../util/appError');
const { ref, uploadBytes } = require('firebase/storage');
const { storage } = require('../util/firebase');

exports.getAllMovie = catchAsync(async (req, res, next) => {
  const movies = await Movie.findAll({
    where: { status: 'active' }
  });

  if (!movies) {
    return next(new AppError(404, 'No movies found'));
  }

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
    where: { id, status: 'active' }
  });

  if (!movie) {
    return next(new AppError(404, 'No movie found with the given ID'));
  }

  res.status(200).json({
    status: 'success',
    data: {
      movie
    }
  });
});

exports.createMovie = catchAsync(async (req, res, next) => {
  const { title, description, duration, rating, img, genere } = req.body;

  if (!title || !description || !duration || !rating || !img || !genere) {
    return next(
      new AppError(
        400,
        'Must provide a valid title, description, duration, rating, img and genere'
      )
    );
  }

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

  if (!movie) {
    return next(new AppError(404, 'Cant update movie, invalid ID'));
  }

  await movie.update({ ...data });

  res.status(204).json({ status: 'success' });
});

exports.deleteMovie = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const movie = await Movie.findOne({
    where: { id, status: 'active' }
  });

  if (!movie) {
    return next(new AppError(404, 'Cant delete movie, invalid ID'));
  }

  await movie.update({ status: 'delete' });

  res.status(204).json({ status: 'success' });
});
