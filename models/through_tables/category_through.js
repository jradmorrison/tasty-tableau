const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../config/connection');

class Category_Through extends Model {}

Category_Through.init(
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
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'category_through',
    indexes: [
      {
        name: 'category_tag_index',
        // type: DataTypes.INTEGER,
        unique: true,
        fields: ['recipe_id', 'category_id'],
      },
    ],
  }
);

module.exports = Category_Through;
