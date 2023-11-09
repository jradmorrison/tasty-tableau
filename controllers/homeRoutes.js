const router = require('express').Router();

const { Category, Recipe, User, Tag, Macros, Favorite, Ingredient, Ingredients_Through } = require('../models');

const withAuth = require('../utils/auth');
const { Op } = require('sequelize');

// ROUTE: /

// GET ROUTES for all views
// Home
router.get('/', async (req, res) => {
  try {
    const cardData = await Recipe.findAll({
      where: { category_id: 6 },
      include: { model: User, attributes: ['username'] },
    });

    const cards = cardData.map((card) => card.get({ plain: true }));
    // cards.forEach(card => card.image = card.images.split(', ')[0].slice(1, -1));

    cards.forEach((card) => {
      card.image = card.images.split(', ')[0].slice(1);
      if (card.image.charAt(card.image.length - 1) === ']') {
        card.image = card.image.slice(0, card.image.length - 1);
      }
    });

    // console.trace(cards);

    res.render('homepage', {
      cards,
      logged_in: req.session.logged_in,
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

    const favoritesData = await Favorite.findAll({
      where: {
        recipe_id: req.params.id,
        user_id: req.session.user_id,
      },
    });

    const isFavorite = favoritesData.length > 0;
    const recipe = recipeData.get({ plain: true });
    const ingredients = ingredientData.map(ing => ing.get({plain: true}));
    
    recipe.images = recipe.images.split(', ')[0].slice(1);
    if (recipe.images.charAt(recipe.images.length - 1) === ']') {
      recipe.images = recipe.images.slice(0, recipe.images.length - 1);
    }

    recipe.instructions = recipe.instructions.slice(1, -1);
    console.log(recipe);
    res.render('recipe', {
      recipe,
      ingredients,
      logged_in: req.session.logged_in,
      is_favorite: isFavorite,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.get('/dashboard', withAuth, async (req, res) => {
  try {
    const userRecipesData = await Recipe.findAll({
      where: {
        user_id: req.session.user_id,

      }

    });
    const favoritesData = await Favorite.findAll({
      where: {
        user_id: req.session.user_id,
      },
      include: [{
        model: Recipe,
      }]
    });

    const userRecipes = userRecipesData.map(rec => rec.get({ plain: true }));
    const favorites = favoritesData.map(fav => fav.get({ plain: true }));
  

    // Grabs the first image and creates a new attribute for it
    userRecipes.forEach((recipe) => {
      recipe.image = recipe.images.split(', ')[0].slice(1);
      if (recipe.image.charAt(recipe.image.length - 1) === ']') {
        recipe.image = recipe.image.slice(0, recipe.image.length - 1);
      }
    });
    favorites.forEach(favorite => {
      favorite.recipe.image = favorite.recipe.images.split(', ')[0].slice(1);
      if (favorite.recipe.image.charAt(favorite.recipe.image.length - 1) === ']') {
        favorite.recipe.image = favorite.recipe.image.slice(0, favorite.recipe.image.length - 1);
      };
    });

    userRecipes.reverse();

    res.render('dashboard', {
      userRecipes,
      favorites,

      logged_in: req.session.logged_in,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/about', async (req, res) => {
  try {
    res.render('about', {
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/team', async (req, res) => {
  try {
    res.render('team', {
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/newrecipe', withAuth, async (req, res) => {
  try {
    // console.trace(req.session.logged_in);
    res.render('newrecipe', {
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    res.status(500).json(err);
  }
})

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

module.exports = router;
