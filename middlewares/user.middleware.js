const { User } = require('../models/userModel');

const { AppError } = require('../util/appError');
const { catchAsync } = require('../util/catchAsync');

exports.userExists = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const user = await User.findOne({
    atributes: { exclude: ['password'] },
    where: { id, status: 'active' }
  });

  if (!user) {
    return next(new AppError(404, 'User not found with given id'));
  }

  req.user = user;
  next();
});

exports.protectAccountOwner = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { currentUser } = req;

  if (currentUser.id !== +id) {
    return next(new AppError(403, 'you cant update other users accounts'));
  }

  next();
});
