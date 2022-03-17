const express = require('express');

const {
  getAllUsers,
  getUserById,
  createUsers,
  updateUsers,
  deleteUsers
} = require('../controllers/user.controller');

const router = express.Router();

router.get('/', getAllUsers);

router.get('/:id', getUserById);

router.post('/', createUsers);

router.patch('/:id', updateUsers);

router.delete('/:id', deleteUsers);

module.exports = { usersRouter: router };
