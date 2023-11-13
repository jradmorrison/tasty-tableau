const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Recipe extends Model {}

Recipe.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'user',
        key: 'id',
      },
    },
    time_cook: {
      type: DataTypes.STRING,
      defaultValue: 'PT',
      allowNull: true,
    },
    time_prep: {
      type: DataTypes.STRING,
      defaultValue: 'PT',
      allowNull: true,
    },
    time_total: {
      type: DataTypes.STRING,
      defaultValue: 'PT',
      allowNull: true,
    },
    date_created: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    images: {
      type: DataTypes.TEXT,
      defaultValue: '[/Assets/Carrot.png]',
      allowNull: true,
    },
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'category',
        key: 'id',
      },
    },
    rating: {
      type: DataTypes.DECIMAL,
      defaultValue: 5,
      allowNull: false,
    },
    servings: {
      type: DataTypes.INTEGER,
      defaultValue: -1,
      allowNull: true,
    },
    yield: {
      type: DataTypes.STRING,
      defaultValue: -1,
      allowNull: true,
    },
    instructions: {
      type: DataTypes.TEXT,
      defaultValue: "-1",
      allowNull: true,
    },
    seed: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: true,
    },
  },
  {
    sequelize,
    timestamps: true,
    freezeTableName: true,
    underscored: true,
    modelName: 'recipe',
  }
);

module.exports = Recipe;
