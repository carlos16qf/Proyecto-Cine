const { User } = require('../models/userModel');
const { ActorInMovie } = require('../models/actorInMovieModel');
const { Actor } = require('../models/actorModel');
const { Movie } = require('../models/movieModel');
const { Review } = require('../models/reviewModel');

const initModels = () => {
  User.hasMany(Review);
  Review.belongsTo(User);

  Movie.hasMany(Review);
  Review.belongsTo(Movie);

  Movie.belongsToMany(Actor, { through: ActorInMovie });
  Actor.belongsToMany(Movie, { through: ActorInMovie });
};

module.exports = { initModels };
