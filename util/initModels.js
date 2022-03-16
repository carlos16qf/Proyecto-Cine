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
};

module.exports = { initModels };
