const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../config/connection');

Ingrediant_Through.init(
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
    modelName: 'ingrediant_through',
  }
);

module.exports = Ingrediant_Through;
