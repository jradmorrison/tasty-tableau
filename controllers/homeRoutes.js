const router = require('express').Router();

const { Category, Recipe, User, Tag, Macros, Favorite, Ingredient, Ingredients_Through, Review } = require('../models');
const { findAll } = require('../models/user');

const withAuth = require('../utils/auth');
const { Op } = require('sequelize');

const formatTime = require('../utils/formatTime');
const formatRecipe = require('../utils/formatRecipe');

// ROUTE: /

// GET ROUTES for all views
// Home
router.get('/', async (req, res) => {
  try {
    let catNum = Math.floor(Math.random() * 113);
    const cardData = await Recipe.findAll({
      where: { category_id: catNum },
      include: { model: User, attributes: ['username'] },
    });

    const cards = cardData.map((card) => card.get({ plain: true }));
    // cards.forEach(card => card.image = card.images.split(', ')[0].slice(1, -1));

    cards.splice(5); // Change to effect how many cards are shown on the screen

    // Reformat cards for display to page
    // Grab first image and use for display
    for (let i = 0; i < cards.length; i++) {
      cards[i] = formatRecipe(cards[i]);
    }

    res.render('homepage', {
      cards,
      logged_in: req.session.logged_in,
      user: req.session.username,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/search/:term', async (req, res) => {
  try {
    // Grab all recipes where 'term' matches in category, name, or description
    const categoryQuery = await Category.findAll({
      attributes: ['id'],
      where: {
        name: {
          [Op.like]: `%${req.params.term}%`,
        },
      },
    });

    const recipeQuery = await Recipe.findAll({
      where: {
        [Op.or]: [
          {
            category_id: {
              [Op.in]: categoryQuery,
            },
          },
          {
            [Op.or]: [
              {
                description: {
                  [Op.like]: `%${req.params.term}%`,
                },
              },
              {
                name: {
                  [Op.like]: `%${req.params.term}%`,
                },
              },
            ],
          },
        ],
      },
    });

    const recipes = await recipeQuery.map((rec) => rec.get({ plain: true }));

    for (let i = 0; i < recipes.length; i++) {
      recipes[i] = formatRecipe(recipes[i]);
    }

    res.render('searchResults', {
      recipes,
      term: req.params.term,
      logged_in: req.session.logged_in,
      user: req.session.username,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/searchAuthor/:id', async (req, res) => {
  try {
    // console.trace(req.params.id);

    // Grab all recipes where 'term' matches in category, name, or description
    const recipeQuery = await Recipe.findAll({
      where: {
        user_id: req.params.id,
      },
    });

    const recipes = await recipeQuery.map((rec) => rec.get({ plain: true }));

    for (let i = 0; i < recipes.length; i++) {
      recipes[i] = formatRecipe(recipes[i]);
    }

    const userNameQuery = await User.findByPk(req.params.id);
    let username = userNameQuery.dataValues.username;

    recipes.sort((a, b) => (a.name < b.name ? -1 : 1));

    res.render('searchResults', {
      recipes,
      term: username,
      logged_in: req.session.logged_in,
      user: req.session.username,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get recipe by ID
router.get('/recipes/:id', async (req, res) => {
  try {
    const recipeData = await Recipe.findByPk(req.params.id, {
      include: [
        {
          model: Tag,
          attributes: ['name'],
        },
        // {
        //   model: Macros,
        // },
        {
          model: User,
          attributes: ['username'],
        },
        {
          model: Review,
          include: [
            {
              model: User,
            },
          ],
        },
      ],
    });

    const ingredientData = await Ingredients_Through.findAll({
      where: {
        recipe_id: req.params.id,
      },
      include: [
        {
          model: Ingredient,
          attributes: ['name'],
        },
      ],
    });

    let favorite = -1;
    if (req.session.user_id) {
      const favoritesData = await Favorite.findAll({
        where: {
          recipe_id: req.params.id,
          user_id: req.session.user_id,
        },
      });
      favorite = favoritesData.length > 0 ? 1 : 0;
    }
    const recipe = recipeData.get({ plain: true });
    const ingredients = ingredientData.map((ing) => ing.get({ plain: true }));

    // console.trace(recipe);
    newRecipe = formatRecipe(recipe);
    // console.trace(newRecipe);

    recipe.instructions = recipe.instructions.slice(1, -1).split('., ');

    console.trace(recipe);

    res.render('recipe', {
      recipe,
      ingredients,
      logged_in: req.session.logged_in,
      user: req.session.username,
      is_favorite: favorite,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/dashboard', withAuth, async (req, res) => {
  try {
    const userRecipesData = await Recipe.findAll({
      where: {
        user_id: req.session.user_id,
      },
    });
    const favoritesData = await Favorite.findAll({
      where: {
        user_id: req.session.user_id,
      },
      include: [
        {
          model: Recipe,
        },
      ],
    });

    const userRecipes = userRecipesData.map((rec) => rec.get({ plain: true }));
    const favorites = favoritesData.map((fav) => fav.get({ plain: true }));

    for (let i = 0; i < userRecipes.length; i++) {
      userRecipes[i] = formatRecipe(userRecipes[i]);
    }

    for (let i = 0; i < favorites.length; i++) {
      favorites[i].recipe = formatRecipe(favorites[i].recipe);
    }

    userRecipes.reverse();
    // favorites.reverse();

    favorites.sort((a, b) => (a.name < b.name ? -1 : 1));

    console.trace(userRecipes[0]);

    res.render('dashboard', {
      userRecipes,
      favorites,

      logged_in: req.session.logged_in,
      user: req.session.username,
      user_id: req.session.user_id,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/about', async (req, res) => {
  try {
    res.render('about', {
      logged_in: req.session.logged_in,
      user: req.session.username,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/team', async (req, res) => {
  try {
    res.render('team', {
      logged_in: req.session.logged_in,
      user: req.session.username,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/newrecipe', withAuth, async (req, res) => {
  try {
    const categoryData = await Category.findAll();
    let categories = categoryData.map((recipe) => recipe.get({ plain: true }));
    categories.sort((a, b) => (a.name < b.name ? -1 : 1));
    categories = categories.slice(4);

    const ingredientData = await Ingredient.findAll();
    let ingredients = ingredientData.map((ing) => ing.get({ plain: true }));
    ingredients.sort((a, b) => (a.name < b.name ? -1 : 1));
    ingredients = ingredients.slice(1);

    const tagData = await Tag.findAll();
    const tags = tagData.map((tag) => tag.get({ plain: true }));
    tags.sort((a, b) => (a.name < b.name ? -1 : 1));

    res.render('newrecipe', {
      categories,
      ingredients,
      tags,
      logged_in: req.session.logged_in,
      user: req.session.username,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Login form
router.get('/login', (req, res) => {
  if (req.session.logged_in) {
    res.redirect('/dashboard');
    return;
  }

  res.render('login');
});

// Signup form
router.get('/signup', (req, res) => {
  if (req.session.logged_in) {
    res.redirect('/dashboard');
    return;
  }
  res.render('signup');
});

router.get('/kurtriecken', (req, res) => {
  try {
    res.render('kurt', {
      logged_in: req.session.logged_in,
      user: req.session.username,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/brandonbarnes', (req, res) => {
  try {
    res.render('brandon', {
      logged_in: req.session.logged_in,
      user: req.session.username,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/jaredmorrison', (req, res) => {
  try {
    res.render('jared', {
      logged_in: req.session.logged_in,
      user: req.session.username,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('*', (req, res) => {
  try {
    res.render('404');
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
