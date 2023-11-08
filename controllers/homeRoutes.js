const router = require('express').Router();
const { Recipe } = require('../models');
const withAuth = require('../utils/auth');

// ROUTE: /

// GET ROUTES for all views
// Home
router.get('/', async (req, res) => {
  try {

    res.render('homepage');
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/dashboard', withAuth, async (req, res) => {
  try {
    console.trace(req.session);
    const userRecipesData = await Recipe.findAll({
      where: {
        user_id: req.session.user_id,
      }
    })
    // console.trace(userRecipes);

    const userRecipes = userRecipesData.map(rec => rec.get({ plain: true }));
    console.trace(userRecipes[0].images);
    console.trace(userRecipes[0].images.split(',')[0].slice(1));

    // Grabs the first image and creates a new attribute for it
    userRecipes.forEach(recipe => {
      recipe.image = recipe.images.split(', ')[0].slice(1);
    });

    console.trace(userRecipes);
    res.render('dashboard', {
      userRecipes,
      logged_in: req.session.logged_in
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/about', async (req, res) => {
  try {
    res.render('about');
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/team', async (req, res) => {
  try {

    res.render('team');
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

module.exports = router;
