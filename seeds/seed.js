const sequelize = require('../config/connection');
const { User, Recipe, Macros, Review, 
  Favorite, Ingredient, Tag, Ingredients_Through, 
  Tag_Through, Category_Through, Category } = require('../models');

const userData = require('./data/userData.json');
const categoryData = require('./data/categoryData.json');
const macroData = require('./data/macrosData.json');
const ingredientData = require('./data/ingredientData.json');
const tagData = require('./data/tagData.json');
const tag_throughData = require('./data/tagthroughData.json');
const recipeData = require('./data/recipeData.json');

const seedDatabase = async () => {
  await sequelize.sync({ force: true });

  console.log('====================================================');
  console.log(' DATABASE SYNCED');
  console.log('====================================================');

  const users = await User.bulkCreate(userData, {
    individualHooks: true,
    returning: true,
  });
  console.log('====================================================');
  console.log(' USERS SEEDED');
  console.log('====================================================');

  const category = await Category.bulkCreate(categoryData, {
    individualHooks: true,
    returning: true,
  });
  console.log('====================================================');
  console.log(' CATEGORIES SEEDED');
  console.log('====================================================');

  const macros = await Macros.bulkCreate(macroData, {
    individualHooks: true,
    returning: true,
  });
  console.log('====================================================');
  console.log(' MACROS SEEDED');
  console.log('====================================================');

  const ingredients = await Ingredient.bulkCreate(ingredientData, {
    individualHooks: true,
    returning: true,
  });
  console.log('====================================================');
  console.log(' INGREDIENTS SEEDED');
  console.log('====================================================');

  const tags = await Tag.bulkCreate(tagData, {
    individualHooks: true,
    returning: true,
  });
  console.log('====================================================');
  console.log(' TAGS SEEDED');
  console.log('====================================================');

  const recipes = await Recipe.bulkCreate(recipeData, {
    individualHooks: true,
    returning: true,
  });
  console.log('====================================================');
  console.log(' RECIPES SEEDED');
  console.log('====================================================');

  const tagThroughs = await Tag_Through.bulkCreate(tag_throughData, {
    individualHooks: true,
    returning: true,
  });
  console.log('====================================================');
  console.log(' TAG THROUGH TABLE SEEDED');
  console.log('====================================================');

  process.exit(0);
};

seedDatabase();
