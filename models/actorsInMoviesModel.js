const { DataTypes } = require('sequelize');
const { dataBase } = require('../util/database');

const ActorInMovies = dataBase.define('actorInMovie', {
    id: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false
      },
    userId: {
        type: DataTypes.STRING(10),
        allowNull: false
      },
    movieId: {
        type: DataTypes.STRING(10),
        allowNull: false
      }
})

module.exports = { ActorInMovies };


