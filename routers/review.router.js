const express = require('express');
const { body } = require('express-validator');
const {
  getAllReview,
  getReviewById,
  createReview,
  updateReview,
  deleteReview
} = require('../controllers/review.controller');
const { validateSession } = require('../middlewares/auth.middlewares');
const { reviewExists } = require('../middlewares/review.middlewares');

const router = express.Router();

router.use(validateSession);
router
  .route('/')
  .get(getAllReview)
  .post(
    [
      body('title').isString().notEmpty(),
      body('comment').isString().notEmpty(),
      body('rating')
        .isNumeric()
        .custom((value) => value > 0 && value <= 5),
      body('movieId').isNumeric().custom()
    ],
    createReview
  );

router
  .use('/:id', reviewExists)
  .route('/:id')
  .get(getReviewById)
  .patch(updateReview)
  .delete(deleteReview);

module.exports = { reviewRouter: router };
