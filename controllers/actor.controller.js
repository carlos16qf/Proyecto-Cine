const { Actor } = require('../models/actorModel');
const { ActorInMovie } = require('../models/actorInmovieModel');
const { Movie } = require('../models/movieModel');

const { validationResult } = require('express-validator');

const { catchAsync } = require('../util/catchAsync');
const { AppError } = require('../util/appError');
const { filterObj } = require('../util/filterObj');
const { ref, uploadBytes, getDownloadURL } = require('firebase/storage');
const { storage } = require('../util/firebase');

exports.getAllActor = catchAsync(async (req, res, next) => {
  const actors = await Actor.findAll({
    where: { status: 'active' },
    include: [{ model: Movie, through: ActorInMovie }]
  });
  // const actorsPromises = actors.map(
  //   async ({
  //     id,
  //     name,
  //     country,
  //     oscarsPrizez,
  //     imgUrl,
  //     rating,
  //     age,
  //     createdAt,
  //     updatedAt
  //   }) => {
  //     const imgRef = ref(storage, imgUrl);

  //     const imgDownloadUrl = await getDownloadURL(imgRef);

  //     return {
  //       id,
  //       name,
  //       country,
  //       oscarsPrizez,
  //       imgUrl: imgDownloadUrl,
  //       rating,
  //       age,
  //       createdAt,
  //       updatedAt
  //     };
  //   }
  // );

  // const resolvedActors = await Promise.all(actorsPromises);

  res.status(200).json({
    status: 'success',
    data: {
      actors
    }
  });
});

exports.getActorById = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const actor = await Actor.findOne({
    where: { id, status: 'active' }
  });

  if (!actor) {
    return next(new AppError(404, 'No actor found with the given ID'));
  }

  res.status(200).json({
    status: 'success',
    data: {
      actor
    }
  });
});

exports.createActor = catchAsync(async (req, res, next) => {
  const { name, country, oscarsPrizez, rating, age } = req.body;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const errorMsg = errors
      .array()
      .map(({ msg }) => msg)
      .join('. ');
    return next(new AppError(400, errorMsg));
  }
  const fileExtension = req.file.originalname.split('.')[1];
  const imgRef = ref(storage, `imgs/${Date.now()}-${fileExtension}`);

  const result = await uploadBytes(imgRef, req.file.buffer);

  const newActor = await Actor.create({
    name: name,
    country: country,
    oscarsPrizez: oscarsPrizez,
    rating: rating,
    profilePic: result.metadata.fullPath,
    age: age
  });

  res.status(201).json({
    status: 'success',
    data: { newActor }
  });
});

exports.updateActor = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const data = filterObj(req.body, 'name', 'country', 'age');

  const actor = await Actor.findOne({
    where: { id, status: 'active' }
  });

  if (!actor) {
    return next(new AppError(404, 'Cant update actor, invalid ID'));
  }

  await actor.update({ ...data });

  res.status(204).json({ status: 'success' });
});

exports.deleteActor = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const actor = await Actor.findOne({
    where: { id, status: 'active' }
  });

  if (!actor) {
    return next(new AppError(404, 'Cant delete actor, invalid ID'));
  }

  await actor.update({ status: 'delete' });

  res.status(204).json({ status: 'success' });
});
