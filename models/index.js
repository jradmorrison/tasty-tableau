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
const Category_Through = require('./through_tables/category_through');

///////////////////////////////////////////////////////
// THROUGH TABLE ASSOCIATIONS                        //
///////////////////////////////////////////////////////
// Recipe/Ingredient
Recipe.belongsToMany(Ingredient, { through: Ingredients_Through });
Ingredient.belongsToMany(Recipe, { through: Ingredients_Through });

// Tag/Recipe
Tag.belongsToMany(Recipe, { through: Tag_Through });
Recipe.belongsToMany(Tag, { through: Tag_Through });

// Category/Recipe
Category.belongsToMany(Recipe, { through: Category_Through });
Recipe.belongsToMany(Category, { through: Category_Through });

///////////////////////////////////////////////////////
// REGULAR ASSOCIATIONS                              //
///////////////////////////////////////////////////////
// User to Recipes -- one to many
User.belongsTo(Recipe, { foreignKey: 'user_id' });
Recipe.hasOne(User, { foreignKey: 'user_id' });

// Recipe to Macros -- one to one
Recipe.belongsTo(Macros);
Macros.hasOne(Recipe);

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

// Commenting out to test
// IngredientsThrough.belongsTo(Recipe, { foreignKey: 'recipe_id' });
// Recipe.hasMany(IngredientsThrough, { foreignKey: 'recipe_id' });
// Ingredient.belongsTo(IngredientsThrough, { foreignKey: 'ingredient_id' });

// Commenting out to test
// TagThrough.belongsTo(Recipe, { foreignKey: 'recipe_id' });
// CategoryThrough.belongsTo(Recipe, { foreignKey: 'recipe_id' });
// Tag.belongsTo(TagThrough, { foreignKey: 'tag_id' });

// Commenting out to test
// Category.belongsTo(CategoryThrough, { foreignKey: 'category_id' });

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
  Category_Through,
  Category,
};
