const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../config/connection');

class Ingredients_Through extends Model {}

Ingredients_Through.init(
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
    ingredient_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'ingredient',
        key: 'id',
      }
    },
    quantity: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'ingredients_through',
    indexes: [
      {
        name: 'ingredient_recipe_index',
        // type: DataTypes.INTEGER,
        unique: true,
        fields: ['ingredient_id', 'recipe_id'],
      },
    ],
  }
);

module.exports = Ingredients_Through;
