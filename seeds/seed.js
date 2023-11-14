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

// RAW data from old database json file
const rawData = require('./database/recipes_1000.json');
// Limit data for deployment to 500 items
const recipesData = {
  recipes_sanitized: rawData.recipes_sanitized.slice(0, 500),
};

// RAW data from old database json file
const reviewData = require('./database/reviews_1000.json');

//=============================================================
//                      Core Database
//=============================================================
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

//=============================================================
//                      Helper
//=============================================================
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

//=============================================================
//                      Core Async
//=============================================================
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

const getRecipes = async (users) => {
  let Recipes = [];
  for (let i = 0; i < recipesData.recipes_sanitized.length; i++) {
    const recipe = recipesData.recipes_sanitized[i];
    let servings = recipe.RecipeServings == '' ? 0 : recipe.RecipeServings;
    let rating = recipe.AggregatedRating == 'No Rating' ? 0 : parseFloat(recipe.AggregatedRating);
    let user_id = await getAuthorId(recipe.AuthorName, users);
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

const getReviews = async (recipes, users) => {
  try {
    let allReviews = [];

    let ourUsers = await Promise.all(users.map((instance) => instance.get()));
    let ourRecipes = await Promise.all(recipes.map((instance) => instance.get()));

    for (const review of reviewData.reviews_sanitized) {
      const username = ourUsers.find((user) => user.username === review.AuthorName.toLowerCase());
      const recipeSeed = recipesData.recipes_sanitized.findIndex((rec) => rec.RecipeId === review.RecipeId);
      if (recipeSeed != -1) {
        const recipeID = ourRecipes.find((rec) => rec.seed === recipeSeed);
        if (username) {
          const newReview = {
            user_id: username.id,
            rating: review.Rating,
            review: review.Review,
            date_created: review.DateSubmitted,
            recipe_id: recipeID.id,
            // Add other properties based on reviewData or anything else
          };

          allReviews.push(newReview);
        }
      } else {
        console.warn(`User not found for review with AuthorName: ${review.AuthorName}`);
      }
    }

    console.log(allReviews);
    return allReviews;
  } catch (error) {
    console.error('Error in getReviews:', error);
    throw error;
  }
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

/**
 * Seeds the database with initial data, including users, categories, tags, ingredients,
 * recipes, macros, recipe ingredients, through tags, and reviews.
 * Note: This script uses data from external sources like recipesData and reviewData.
 * @returns {Promise<void>} - Exits the Node.js process on completion.
 */
const seedDatabase = async () => {
  // INITILIZE
  await sequelize.sync({ force: true });

  //SEED STATIC CORE
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

  //SEED ALT TABLES
  const [allMacros] = await Promise.all([getMacros()]);
  const [allRecipesIngredients, allThroughTags] = await Promise.all([getRecipeIngredients(), linkThroughTags()]);
  const [macros, ingrediants, throughTags] = await Promise.all([
    Macros.bulkCreate(allMacros, {}),
    Ingredients_Through.bulkCreate(allRecipesIngredients, {}),
    Tag_Through.bulkCreate(allThroughTags, {}),
  ]);

  const allReviews = await getReviews(recipe, users);
  const review = await Review.bulkCreate(allReviews, {});
  process.exit(0);
};

//=============================================================
//                     Running Logic
//=============================================================
let allCategories = getCategories(); //Done
let allTags = getTags(); //Done
let allIngredients = getIngredients(); //Done
let allUsers = getUsers(); //Done
let throughTags = [];

seedDatabase();
