const { Actor } = require('../models/actorModel');

//utils
const { catchAsync } = require('../util/catchAsync');
const { AppError } = require('../util/appError');
const { filterObj } = require('../util/filterObj');
const { ref, uploadBytes } = require('firebase/storage');
const { storage } = require('../util/firebase');

exports.getAllActor = catchAsync(async (req, res, next) => {
  const actors = await Actor.findAll({
    where: { status: 'active' }
  });

  if (!actors) {
    return next(new AppError(404, 'No actors found'));
  }

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
  const { name, country, oscarsPrizez, rating, profilePic, age } = req.body;

  if (!name || !country || !oscarsPrizez || !rating || !profilePic || !age) {
    return next(
      new AppError(
        400,
        'Must provide a valid name, country, oscarsPrizez, rating, profilePic and age'
      )
    );
  }

  const imgRef = ref(storage, `imgs/${Date.now()}-${req.file.originalname}`);

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
