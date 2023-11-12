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
    // Change total time to readable string
    cards.forEach((card) => {
      card.image = card.images.split(', ')[0].slice(1);
      if (card.image.charAt(card.image.length - 1) === ']') {
        card.image = card.image.slice(0, card.image.length - 1);
      }

      if (!card.time_total.startsWith('PT')) {
        card.time_total = 'Cook time not available'
      }
      else {
        card.time_total = card.time_total.slice(2);
        card.time_total = formatTime(card.time_total);
        if (card.time_total == '0 seconds') {
          card.time_total = 'Cook time not available';
        }
      }

    });

    res.render('homepage', {
      cards,
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
          include: [{
            model: User,
          }]
        }
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

    recipe.images = recipe.images.split(', ')[0].slice(1);
    if (recipe.images.charAt(recipe.images.length - 1) === ']') {
      recipe.images = recipe.images.slice(0, recipe.images.length - 1);
    }
    if (!recipe.time_total.startsWith('PT')) {
      recipe.time_total = 'Cook time not available'
    }
    else {
      recipe.time_total = recipe.time_total.slice(2);
      recipe.time_total = formatTime(recipe.time_total);
      if (recipe.time_total == '0 seconds') {
        recipe.time_total = 'Cook time not available';
      }
    }


    recipe.instructions = recipe.instructions.slice(1, -1).split('., ');

    console.trace(recipe.instructions);

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

    // Grabs the first image and creates a new attribute for it
    userRecipes.forEach((recipe) => {
      if (recipe.images == '') {
        recipe.image = './Assets/Carrot.png';
      } else {
        recipe.image = recipe.images.split(', ')[0].slice(1);
        if (recipe.image.charAt(recipe.image.length - 1) === ']') {
          recipe.image = recipe.image.slice(0, recipe.image.length - 1);
        }
      }
      if (!recipe.time_total.startsWith('PT') || recipe.time_total == 'PT0S') {
        recipe.time_total = 'Cook time not available'
      }
      else {
        recipe.time_total = recipe.time_total.slice(2);
        recipe.time_total = formatTime(recipe.time_total);
        if (recipe.time_total == '0 seconds') {
          recipe.time_total = 'Cook time not available';
        }
      }
    });


    favorites.forEach((favorite) => {
      favorite.recipe.image = favorite.recipe.images.split(', ')[0].slice(1);
      if (favorite.recipe.image.charAt(favorite.recipe.image.length - 1) === ']') {
        favorite.recipe.image = favorite.recipe.image.slice(0, favorite.recipe.image.length - 1);
      }
      if (!favorite.recipe.time_total.startsWith('PT')) {
        favorite.recipe.time_total = 'Cook time not available'
      } else {
        favorite.recipe.time_total = favorite.recipe.time_total.slice(2);
        favorite.recipe.time_total = formatTime(favorite.recipe.time_total);
        if (favorite.time_total == '0 seconds') {
          favorite.time_total = 'Cook time not available';
        }
      }

    });

    userRecipes.reverse();
    console.trace(userRecipes);


    res.render('dashboard', {
      userRecipes,
      favorites,

      logged_in: req.session.logged_in,
      user: req.session.username,
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

    // const cards = cardData.map((card) => card.get({ plain: true }));

    const categories = categoryData.map((recipe) => recipe.get({ plain: true }));

    // Sort alphabetically by name
    categories.sort((a, b) => (a.name < b.name ? -1 : 1));

    res.render('newrecipe', {
      categories,
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

router.get('*', (req, res) => {
  try {
    res.render('404');
  } catch (err) {
    res.status(500).json(err);
  }
})

module.exports = router;
