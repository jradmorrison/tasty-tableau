const sequelize = require('../config/connection');
const { User, Recipe, Macros, Review, Favorite, Ingredient, Tag, IngredientsThrough, TagThrough, CategoryThrough, Category } = require('../models');

const userData = require('./data/userData.json');
const categoryData = require('./data/categoryData.json');

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

  process.exit(0);
};

seedDatabase();
