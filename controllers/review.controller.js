const { catchAsync } = require('../util/catchAsync');
const { Review } = require('../models/reviewModel');
const { AppError } = require('../util/appError');
const { Movie } = require('../models/movieModel');
const { User } = require('../models/userModel');

exports.getAllReview = catchAsync(async (req, res, next) => {
  const reviews = awaitReview.findAll({
    where: { status: 'active' },
    include: [
      { model: Movie },
      { model: User, attributes: { exclude: ['password'] } }
    ]
  });

  res.status(200).json({
    status: 'success',
    data: {
      reviews
    }
  });
});

exports.getReviewById = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const review = await Review.findOne({
    where: { id, status: 'active' }
  });

  if (!review) {
    return next(new AppError(404, 'No review found with the given ID'));
  }

  res.status(200).json({
    status: 'success',
    data: {
      review
    }
  });
});

exports.createReview = catchAsync(async (req, res, next) => {
  const { title, comment, rating, userId, movieId } = req.body;

  const newreview = await Review.create({
    title: title,
    comment: comment,
    rating: rating,
    userId: userId,
    movieId: movieId
  });

  res.status(201).json({
    status: 'success',
    data: { newreview }
  });
});

exports.updateReview = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const data = filterObj(req.body, 'title', 'comment', 'rating');

  const review = await Review.findOne({
    where: { id, status: 'active' }
  });

  await review.update({ ...data });

  res.status(204).json({ status: 'success' });
});

exports.deleteReview = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const review = await Review.findOne({
    where: { id, status: 'active' }
  });

  await review.update({ status: 'delete' });

  res.status(204).json({ status: 'success' });
});
