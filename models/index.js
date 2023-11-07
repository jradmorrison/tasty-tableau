const User = require('./user');
const Recipe = require('./recipe');
const Macros = require('./macros');
const User = require('./user');
const Review = require('./review');
const Likes = require('./likes');
const User = require('./user');
const Ingredient = require('./ingrediant');
const Tag = require('./tag');

const IngredientsThrough = require('./through_table/ingrediants_through');
const TagThrough = require('./through_table/tag_through');
const CategoryThrough = require('./through_tables/category_through');

User.belongsTo(Recipe, { foreignKey: 'user_id' });
Recipe.hasOne(User, { foreignKey: 'user_id' });

Recipe.belongsTo(Macros, { foreignKey: 'macros_id' });

User.belongsTo(Review, { foreignKey: 'user_id' });

User.belongsTo(Likes, { foreignKey: 'user_id' });
Recipe.belongsTo(Likes, { foreignKey: 'recipe_id' });

IngredientsThrough.belongsTo(Recipe, { foreignKey: 'recipe_id' });
Recipe.hasMany(IngredientsThrough, { foreignKey: 'recipe_id' });

Ingredient.belongsTo(IngredientsThrough, { foreignKey: 'ingredient_id' });

TagThrough.belongsTo(Recipe, { foreignKey: 'recipe_id' });
CategoryThrough.belongsTo(Recipe, { foreignKey: 'recipe_id' });

Category.belongsTo(CategoryThrough, { foreignKey: 'category_id' });
Tag.belongsTo(TagThrough, { foreignKey: 'tag_id' });

Review.belongsTo(Recipe, { foreignKey: 'reviews_id' });

module.exports = { User, Recipe, Macros, Review, Likes, Ingredient, Tag };
