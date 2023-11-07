const User = require('./user');
const Recipe = require('./recipe');
const Macros = require('./macros');
const Review = require('./review');
const Favorite = require('./favorites');
const Ingredient = require('./ingredient');
const Category = require('./category');
const Tag = require('./tag');

const IngredientsThrough = require('./through_tables/ingredients_through');
const TagThrough = require('./through_tables/tag_through');
const CategoryThrough = require('./through_tables/category_through');

User.belongsTo(Recipe, { foreignKey: 'user_id' });
Recipe.hasOne(User, { foreignKey: 'user_id' });

Recipe.belongsTo(Macros, { foreignKey: 'macros_id' });

User.belongsTo(Review, { foreignKey: 'user_id' });

User.belongsTo(Favorite, { foreignKey: 'user_id' });
Recipe.belongsTo(Favorite, { foreignKey: 'recipe_id' });

IngredientsThrough.belongsTo(Recipe, { foreignKey: 'recipe_id' });
Recipe.hasMany(IngredientsThrough, { foreignKey: 'recipe_id' });

Ingredient.belongsTo(IngredientsThrough, { foreignKey: 'ingredient_id' });

TagThrough.belongsTo(Recipe, { foreignKey: 'recipe_id' });
CategoryThrough.belongsTo(Recipe, { foreignKey: 'recipe_id' });

Category.belongsTo(CategoryThrough, { foreignKey: 'category_id' });
Tag.belongsTo(TagThrough, { foreignKey: 'tag_id' });

Review.belongsTo(Recipe, { foreignKey: 'recipe_id' });
Recipe.hasMany(Review, { foreignKey: 'recipe_id' });


module.exports = { User, Recipe, Macros, Review, Favorite, Ingredient, Tag, IngredientsThrough, TagThrough, CategoryThrough, Category };
