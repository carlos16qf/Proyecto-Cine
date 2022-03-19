const express = require('express');

const {
  getAllMovie,
  createMovie,
  getMovieById,
  updateMovie,
  deleteMovie
} = require('../controllers/movie.controller');

const {} = require('../util/multer');

const router = express.Router();

router.get('/', getAllMovie);

router.get('/:id', getMovieById);

router.post('/', upload.single('img'), createMovie);

router.patch('/:id', updateMovie);

router.delete('/:id', deleteMovie);

module.exports = { movieRouter: router };
