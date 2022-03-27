const { async } = require('@firebase/util');
const { Review } = require('../models/reviewModel');

const { AppError } = require('../util/appError');
const { catchAsync } = require('../util/catchAsync');

exports.reviewExists = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const review = await Review.findOne({ where: { id, status: 'active' } });

  if (!review) {
    return next(new AppError(404, 'No movie found with that ID'));
  }

  req.review = review;
  next();
});
