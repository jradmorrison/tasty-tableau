const User = require('./user');
const Project = require('./recipe');

User.hasMany(Recipe, { foreignKey: 'user_id' });
Recipe.belongsTo(User, { foreignKey: 'user_id' });

Recipe.belongsTo(Category, { foreignKey: 'category_id' });

Recipe.belongsToMany(Tag, { through: TagRecipe, foreignKey: 'recipe_id' });
Tag.belongsToMany(Recipe, { through: TagRecipe, foreignKey: 'tag_id' });

Recipe.belongsTo(Macros, { foreignKey: 'macros_id' });

Recipe.belongsToMany(Review, { through: RecipeReview, foreignKey: 'recipe_reviews_id' });
Review.belongsToMany(Recipe, { through: RecipeReview, foreignKey: 'review_id' });

User.hasMany(Review, { foreignKey: 'author_id' });
User.hasMany(Likes, { foreignKey: 'user' });
Recipe.hasMany(Likes, { foreignKey: 'recipe' });

IngredientsThrough.belongsTo(Recipe, { foreignKey: 'recipe_id' });
Ingredient.belongsTo(IngredientsThrough, { foreignKey: 'ingredient_id' });

module.exports = { User, Project };
