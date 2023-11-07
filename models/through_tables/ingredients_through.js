const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../config/connection');

class Ingredient_Through extends Model {}

Ingredient_Through.init(
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
    },
    ingrediant_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    quantitity: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'ingredient_through',
  }
);

module.exports = Ingredient_Through;
