const express = require('express');

const {
  getAllUsers,
  getUserById,
  createUsers,
  updateUsers,
  deleteUsers,
  loginUser
} = require('../controllers/user.controller');

const {
  validateSession,
  protectAdmin
} = require('../middlewares/auth.middlewares');

const router = express.Router();

router.post('/', createUsers);

router.post('/login', loginUser);

router.use(validateSession);

router.get('/', protectAdmin, getAllUsers);

router.get('/:id', getUserById);

router.patch('/:id', updateUsers);

router.delete('/:id', deleteUsers);

module.exports = { usersRouter: router };
