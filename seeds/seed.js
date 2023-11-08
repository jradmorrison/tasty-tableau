const sequelize = require('../config/connection');
const {
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
} = require('../models');

const recipesData = require('./database/recipes_1000.json');

const getUsers = () => {
  let users = [];
  for (const recipe of recipesData.recipes_sanitized) {
    let name = recipe.AuthorName.toLowerCase();
    const userExists = users.some((user) => user.username === name);

    if (!userExists) {
      const newUser = {
        username: recipe.AuthorName.toLowerCase(),
        email: 'NULL',
        password: 'NULL',
        isAdmin: false, // Use a boolean value, not a string
      };
      users.push(newUser);
    }
  }
  return users;
};

const getCategories = () => {
  let categories = [];
  for (const recipe of recipesData.recipes_sanitized) {
    const categoryExists = categories.some((category) => category.name === recipe.RecipeCategory);

    if (!categoryExists) {
      const newCategory = {
        name: recipe.RecipeCategory,
      };
      categories.push(newCategory);
    }
  }
  return categories;
};

const getTags = () => {
  let tags = [];
  for (const recipe of recipesData.recipes_sanitized) {
    let recipeTags = recipe.Keywords.slice(1, -1)
      .split(',')
      .map((keyword) => keyword.trim());
    for (const t of recipeTags) {
      const tagExists = tags.some((tag) => tag.name === t);

      if (!tagExists) {
        const newTag = {
          name: t,
        };
        tags.push(newTag);
      }
    }
  }
  return tags;
};

const getRecipes = async () => {
  let Recipes = [];
  for (let i = 0; i < recipesData.recipes_sanitized.length; i++) {
    const recipe = recipesData.recipes_sanitized[i];
    let servings = recipe.RecipeServings == '' ? 0 : recipe.RecipeServings;
    let rating = recipe.AggregatedRating == 'No Rating' ? 0 : parseFloat(recipe.AggregatedRating);
    let user_id = await getAuthorId(recipe.AuthorName);
    const newRecipe = {
      name: recipe.Name,
      user_id: user_id,
      time_cook: recipe.CookTime,
      time_prep: recipe.PrepTime,
      time_total: recipe.TotalTime,
      date_created: recipe.DatePublished,
      description: recipe.Description,
      images: recipe.Images,
      category_id: await getCategoryId(recipe.RecipeCategory),
      rating: rating,
      servings: servings,
      yield: recipe.RecipeYield,
      instructions: recipe.RecipeInstructions,
      seed: i,
    };

    console.log(newRecipe);
    Recipes.push(newRecipe);

    //Through Tags
    let recipeTags = recipe.Keywords.slice(1, -1)
      .split(',')
      .map((keyword) => keyword.trim());
    for (const t of recipeTags) {
      const newTag = {
        recipe_id: i,
        tag_id: await getTagId(t),
      };
      throughTags.push(newTag);
    }
  }
  return Recipes;
};

const getAuthorId = async (author) => {
  try {
    const user_id = await User.findOne({
      attribute: ['id'],
      where: {
        username: author,
      },
    });
    if (user_id) {
      return user_id.get({ plain: true }).id;
    } else {
      return;
    }
  } catch (error) {
    console.error('Error');
  }
};

const getCategoryId = async (category) => {
  try {
    const category_id = await Category.findOne({
      attribute: ['id'],
      where: {
        name: category,
      },
    });
    if (category_id) {
      return category_id.get({ plain: true }).id;
    } else {
      return;
    }
  } catch (error) {
    console.error('Error');
  }
};

const getTagId = async (tag) => {
  try {
    const Tag_id = await Tag.findOne({
      attribute: ['id'],
      where: {
        name: tag,
      },
    });
    if (Tag_id) {
      return Tag_id.get({ plain: true }).id;
    } else {
      return;
    }
  } catch (error) {
    console.error('Error');
  }
};

const getMacros = async () => {
  let Macros = [];
  for (let i = 0; i < recipesData.recipes_sanitized.length; i++) {
    const recipe = recipesData.recipes_sanitized[i];
    const recipe_id = await getRecipeIdBySeed(i);
    const newRecipeMacro = {
      recipe_id: recipe_id,
      calories: recipe.Calories,
      fat: recipe.FatContent,
      saturated_fat: recipe.SaturatedFatContent,
      cholesterol: recipe.CholesterolContent,
      sodium: recipe.SodiumContent,
      carbohydrate: recipe.CarbohydrateContent,
      fiber: recipe.FiberContent,
      sugar: recipe.SugarContent,
      protein: recipe.ProteinContent,
    };

    Macros.push(newRecipeMacro);
  }
  return Macros;
};

const getIngredients = () => {
  let Ingredients = [];
  for (const recipe of recipesData.recipes_sanitized) {
    let recipeIngredients = recipe.RecipeIngredientParts.slice(1, -1)
      .split(',')
      .map((keyword) => keyword.trim());
    for (const i of recipeIngredients) {
      const ingrediantExists = Ingredients.some((ing) => ing.name === i);

      if (!ingrediantExists) {
        const newIng = {
          name: i,
        };
        Ingredients.push(newIng);
      }
    }
  }
  return Ingredients;
};

const getRecipeIngredients = async () => {
  let IngredientList = [];
  let IngrediantMap = [];

  for (let i = 0; i < recipesData.recipes_sanitized.length; i++) {
    const recipe = recipesData.recipes_sanitized[i];
    let recipeIngredients = recipe.RecipeIngredientParts.slice(1, -1)
      .split(',')
      .map((keyword) => keyword.trim());

    let recipeIngredientQuantities = recipe.RecipeIngredientQuantities.slice(1, -1)
      .split(',')
      .map((keyword) => keyword.trim());

    for (let j = 0; j < recipeIngredients.length; j++) {
      // ? Null check Here possibly
      let recipe_id = await getRecipeIdBySeed(i);
      let ingredient_id = await getIngredientByValue(recipeIngredients[j]);

      const key = `${recipe_id}_${ingredient_id}`;

      let quantity = isNaN(recipeIngredientQuantities[j]) ? 0 : parseFloat(recipeIngredientQuantities[j]);
      if (IngrediantMap[key]) {
        IngrediantMap[key].quantity += quantity;
      } else {
      }

      IngrediantMap[key] = {
        recipe_id: recipe_id,
        ingredient_id: ingredient_id,
        quantity: quantity,
      };

      IngredientList = Object.values(IngrediantMap);
    }
  }
  return IngredientList;
};

const getIngredientByValue = async (value) => {
  try {
    const ing_id = await Ingredient.findOne({
      attribute: ['id'],
      where: {
        name: value,
      },
    });
    if (ing_id) {
      return ing_id.get({ plain: true }).id;
    } else {
      return;
    }
  } catch (error) {
    console.error('Error');
  }
};

const getRecipeIdBySeed = async (seed) => {
  try {
    const recipe_id = await Recipe.findOne({
      attribute: ['id'],
      where: {
        seed: seed,
      },
    });
    if (recipe_id) {
      return recipe_id.get({ plain: true }).id;
    } else {
      return;
    }
  } catch (error) {
    console.error('Error');
  }
};

const linkThroughTags = async () => {
  for (const tag of throughTags) {
    tag.recipe_id = await getRecipeIdBySeed(tag.recipe_id);
  }
  return throughTags;
};

const seedDatabase = async () => {
  await sequelize.sync({ force: true });

  console.log('====================================================');
  console.log(' DATABASE SYNCED');
  console.log('====================================================');

  const [users, categories, tag, ing] = await Promise.all([
    User.bulkCreate(allUsers, {
      individualHooks: true,
    }),

    Category.bulkCreate(allCategories, {}),

    Tag.bulkCreate(allTags, {}),

    Ingredient.bulkCreate(allIngredients, {}),
  ]);
  const [allRecipes] = await Promise.all([getRecipes()]);
  const recipe = await Recipe.bulkCreate(allRecipes, {});
  const [allMacros] = await Promise.all([getMacros()]);
  const [allRecipesIngredients, allThroughTags] = await Promise.all([getRecipeIngredients(), linkThroughTags()]);
  const [macros, ingrediants, throughTags] = await Promise.all([
    Macros.bulkCreate(allMacros, {}),
    Ingredients_Through.bulkCreate(allRecipesIngredients, {}),
    Tag_Through.bulkCreate(allThroughTags, {}),
  ]);
  // const users = await User.bulkCreate(allUsers, {
  //   individualHooks: true,
  //   returning: true,
  // });

  // const categories = await Category.bulkCreate(allCategories, {
  //   individualHooks: true,
  //   returning: true,
  // });

  // const tag = await Tag.bulkCreate(allTags, {
  //   individualHooks: true,
  //   returning: true,
  // });

  // const ing = await Ingredient.bulkCreate(allIngredients, {
  //   individualHooks: true,
  //   returning: true,
  // });

  // let allRecipes = await getRecipes();

  // console.log(throughTags);

  // let allMacros = await getMacros();

  // const macros = await Macros.bulkCreate(allMacros, {
  //   individualHooks: true,
  //   returning: true,
  // });

  // let allRecipesIngredients = await getRecipeIngredients();
  // const ingrediants = await Ingredients_Through.bulkCreate(allRecipesIngredients, {
  //   individualHooks: true,
  //   returning: true,
  // });

  // // let allThroughTags = await linkThroughTags();
  // const throughTags = await Tag_Through.bulkCreate(allThroughTags, {
  //   individualHooks: true,
  //   returning: true,
  // });
  // console.log(allRecipesIngredients);
  process.exit(0);
};

//=============== LOGIC ==============
let allCategories = getCategories(); //Done
let allTags = getTags(); //Done
let allIngredients = getIngredients(); //Done
let allUsers = getUsers(); //Done
let throughTags = [];

seedDatabase();

//TODO Connect ThroughTags using i
//TODO Connect Macros using i
