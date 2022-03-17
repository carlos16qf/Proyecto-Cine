const { User } = require('../models/userModel');
const { ActorInMovies } = require('../models/actorsInMoviesModel');
const { Actor } = require('../models/actorModel');
const { Movie } = require('../models/movieModel');
const { Reviews } = require('../models/reviewsModel');

const initModels = () => {
  User.hasMany(Reviews);
  Reviews.belongsTo(User);

  Movie.hasMany(Reviews);
  Reviews.belongsTo(Movie);

  Movie.belongsToMany(Actor);
  Actor.belongsToMany(Movie);

  ActorInMovies.belongsToMany(Movie);
  Movie.belongsToMany(ActorInMovies);

  User.hasMany(Movie);
  Movie.belongsTo(User);

  User.hasMany(Actor);
  Actor.belongsTo(User);
};

module.exports = { initModels };
