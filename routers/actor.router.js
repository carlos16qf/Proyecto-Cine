const express = require('express');

const {
  getAllActor,
  getActorById,
  createActor,
  updateActor,
  deleteActor
} = require('../controllers/actor.controller');

const router = express.Router();

router.get('/', getAllActor);

router.get('/:id', getActorById);

router.post('/', upload.single('profilePic'), createActor);

router.patch('/:id', updateActor);

router.delete('/:id', deleteActor);

module.exports = { actorRouter: router };
