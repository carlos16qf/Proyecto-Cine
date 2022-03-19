const express = require('express');

const {
  getAllReview,
  getReviewById,
  createReview,
  updateReview,
  deleteReview
} = require('../controllers/review.controller');

const router = express.Router();

router.get('/', getAllReview);

router.get('/', getReviewById);

router.post('/', createReview);

router.patch('/', updateReview);

router.delete('/', deleteReview);

module.exports = { reviewRouter: router };
