// Model imports
const User = require('./user');
const Recipe = require('./recipe');
const Macros = require('./macros');
const Review = require('./review');
const Favorite = require('./favorites');
const Ingredient = require('./ingredient');
const Category = require('./category');
const Tag = require('./tag');

// Through tables
const Ingredients_Through = require('./through_tables/ingredients_through');
const Tag_Through = require('./through_tables/tag_through');

///////////////////////////////////////////////////////
// THROUGH TABLE ASSOCIATIONS                        //
///////////////////////////////////////////////////////

Recipe.belongsToMany(Ingredient, { through: Ingredients_Through, foreignKey: 'recipe_id' });
Ingredient.belongsToMany(Recipe, { through: Ingredients_Through, foreignKey: 'ingredient_id' });

Ingredients_Through.belongsTo(Ingredient, { foreignKey: 'ingredient_id' });
Ingredients_Through.belongsTo(Recipe, { foreignKey: 'recipe_id' });

// Tag/Recipe
Tag.belongsToMany(Recipe, { through: Tag_Through });
Recipe.belongsToMany(Tag, { through: Tag_Through });

///////////////////////////////////////////////////////
// REGULAR ASSOCIATIONS                              //
///////////////////////////////////////////////////////
// User to Recipes -- one to many
User.hasMany(Recipe, { foreignKey: 'user_id' });
Recipe.belongsTo(User, { foreignKey: 'user_id' });

// Recipe to Macros -- one to one
Macros.belongsTo(Recipe, { foreignKey: 'recipe_id' });

// User to Favorite -- one to many
User.hasMany(Favorite, { foreignKey: 'user_id' });
Favorite.belongsTo(User, { foreignKey: 'user_id' });

// Recipe to Favorite -- one to many
Recipe.hasMany(Favorite, { foreignKey: 'recipe_id' });
Favorite.belongsTo(Recipe, { foreignKey: 'recipe_id' });

// Recipe to Review -- one to many
Recipe.hasMany(Review, { foreignKey: 'recipe_id' });
Review.belongsTo(Recipe, { foreignKey: 'recipe_id' });

// User to Review -- one to many
User.hasMany(Review, { foreignKey: 'user_id' });
Review.belongsTo(User, { foreignKey: 'user_id' });

module.exports = {
  User,
  Recipe,
  Macros,
  Review,
  Favorite,
  Ingredient,
  Tag,
  Ingredients_Through,
  Tag_Through,
  Category,
};
