const sequelize = require('../config/connection');
const { User, Recipe, Macros, Review, 
  Favorite, Ingredient, Tag, IngredientsThrough, 
  TagThrough, CategoryThrough, Category } = require('../models');

const userData = require('./data/userData.json');
const categoryData = require('./data/categoryData.json');
const macroData = require('./data/macrosData.json');

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

  console.trace(User);
  console.trace(Category);
  console.trace(Macros);

  const macros = await Macros.bulkCreate(macroData, {
    individualHooks: true,
    returning: true,
  });
  console.log('====================================================');
  console.log(' MACROS SEEDED');
  console.log('====================================================');

  process.exit(0);
};

seedDatabase();
