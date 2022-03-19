const { catchAsync } = require('../util/catchAsync');
const { User } = require('../models/userModel');
const { AppError } = require('../util/appError');
const bcrypt = require('bcryptjs');

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.findAll({
    where: { status: 'active' },
    attributes: { exclude: ['password'] }
  });

  if (!users) {
    return next(new AppError(404, 'No User found'));
  }

  res.status(200).json({
    status: 'success',
    data: {
      users
    }
  });
});

exports.getUserById = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const user = await User.findOne({
    where: { id, status: 'active' },
    attributes: { exclude: ['password'] }
  });

  if (!user) {
    return next(new AppError(404, 'No user found with the given ID'));
  }

  res.status(200).json({
    status: 'success',
    data: {
      user
    }
  });
});

exports.createUsers = catchAsync(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    return next(
      new AppError(400, 'Must provide a valid name, email, password and role')
    );
  }
  const salt = await bcrypt.genSalt(12);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = await User.create({
    name: name,
    email: email,
    password: hashedPassword,
    role: role
  });

  newUser.password = undefined;

  res.status(201).json({
    status: 'success',
    data: { newUser }
  });
});

exports.updateUsers = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const data = filterObj(req.body, 'name', 'email');

  const user = await User.findOne({
    where: { id, status: 'active' }
  });

  if (!user) {
    return next(new AppError(404, 'Cant update user, invalid ID'));
  }

  await user.update({ ...data });

  res.status(204).json({ status: 'success' });
});

exports.deleteUsers = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const user = await User.findOne({
    where: { id, status: 'active' }
  });

  if (!user) {
    return next(new AppError(404, 'Cant delete user, invalid ID'));
  }

  await user.update({ status: 'delete' });

  res.status(204).json({ status: 'success' });
});
