const { DataTypes } = require('sequelize');
const { dataBase } = require('../util/database');

const Reviews = dataBase.define('review', {
  id: {
    primaryKey: true,
    autoIncrement: true,
    type: DataTypes.INTEGER,
    allowNull: false
  },
  title: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  Comment: {
    type: DataTypes.STRING(100),
    unique: true,
    allowNull: false
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  status: {
    type: DataTypes.STRING(10),
    defaultValue: 'active',
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
});

module.exports = { Reviews };
