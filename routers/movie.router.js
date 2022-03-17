const express = require('express');

const {
  getAllMovie,
  createMovie,
  getMovieById,
  updateMovie,
  deleteMovie
} = require('../controllers/movie.controller');

const router = express.Router();

router.get('/', getAllMovie);

router.get('/:id', getMovieById);

router.post('/', createMovie);

router.patch('/:id', updateMovie);

router.delete('/:id', deleteMovie);

module.exports = { movieRouter: router };
