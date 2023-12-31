const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Macros extends Model {}

Macros.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    recipe_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'recipe',
        key: 'id',
      }
    },
    calories: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    fat: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    saturated_fat: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    cholesterol: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    sodium: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    carbohydrate: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    fiber: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    sugar: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    protein: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'macros',
  }
);

module.exports = Macros;
