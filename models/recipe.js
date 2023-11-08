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
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    time_cook: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    time_prep: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    time_total: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    date_created: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    date_modified: {
      type: DataTypes.DATEONLY,
      defaultValue: '1970-01-01',
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    images: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
<<<<<<< HEAD
    tag_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
=======
    macros_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'macros',
        key: 'id',
      }
>>>>>>> b6cc71d6d7e37ab1b2f615a0ebd3a90f7857ee56
    },
    servings: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    yield: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    instructions: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    seed: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'recipe',
  }
);

module.exports = Recipe;
