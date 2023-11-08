const { DataTypes } = require('sequelize');
const sequelize = require('../../config/connection');

const AllRecipes = sequelize.define(
  'recipes_sanitized',
  {
    RecipeId: DataTypes.INTEGER,
    RecipeCategory: DataTypes.STRING,
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    modelName: 'recipes_sanitized',
  }
);

async function getRecipeCategories() {
  try {
    const categories = await AllRecipes.findAll({
      attributes: ['RecipeId', 'RecipeCategory'],
    });
    return categories;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

getRecipeCategories()
  .then((categories) => {
    const allCategories = [];
    for (const category of categories) {
      const categoryName = category.RecipeCategory;
      if (!allCategories.some((obj) => obj.name === categoryName)) {
        allCategories.push({ name: categoryName });
      }
    }
    console.log(allCategories);
  })
  .catch((error) => {
    console.error('Error:', error);
  });

const seedCategories = async () => {
  await sequelize.sync({ force: false });

  console.log('====================================================');
  console.log(' DATABASE SYNCED');
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
