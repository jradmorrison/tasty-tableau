const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../config/connection');

class Tag_Through extends Model {}

Tag_Through.init(
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
      },
    },
    tag_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'tag',
        key: 'id',
      },
    },
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'tag_through',
    indexes: [
      {
        name: 'recipe_tag_index',
        unique: true,
        fields: ['recipe_id', 'tag_id'],
      },
    ],
  }
);

module.exports = Tag_Through;
