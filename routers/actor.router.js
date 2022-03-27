const express = require('express');
const { body } = require('express-validator');
const {
  getAllActor,
  getActorById,
  createActor,
  updateActor,
  deleteActor
} = require('../controllers/actor.controller');

const { actorExists } = require('../middlewares/actors.middleware');

const { upload } = require('../util/multer');
const {
  validateSession,
  protectAdmin
} = require('../middlewares/auth.middlewares');

const router = express.Router();
router.use(validateSession);
router
  .route('/')
  .get(getAllActor)
  .post(
    protectAdmin,
    upload.single('profilePic'),
    [
      body('name').isString().notEmpty(),
      body('country')
        .isString()
        .withMessage('Country must be a string')
        .notEmpty()
        .withMessage('Must provide a valid country name'),
      body('oscarsPrizez')
        .isNumeric()
        .withMessage('Oscars Prizez must be a number')
        .custom((value) => value >= 0)
        .withMessage('Oscars Prizez must be greater than 0'),
      body('rating')
        .isNumeric()
        .withMessage('Rating must be a number')
        .custom((value) => value > 0 && value <= 5)
        .withMessage('Rating must be between 1 and 5'),
      body('age')
        .isNumeric()
        .withMessage('Age must be a number')
        .custom((value) => value > 0)
        .withMessage('Age must be greater than 0')
    ],
    createActor
  );

router
  .use('/:id', actorExists)
  .route('/:id')
  .get(getActorById)
  .patch(protectAdmin, updateActor)
  .delete(protectAdmin, deleteActor);

module.exports = { actorRouter: router };
