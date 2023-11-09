const router = require('express').Router();
const { Category, Recipe, User, Tag, Macros } = require('../models');
const withAuth = require('../utils/auth');

// ROUTE: /

// GET ROUTES for all views
// Home
router.get('/', async (req, res) => {
  try {
    const cardData = await Recipe.findAll({
      where: { category_id: 6 },
      include: { model: User, attributes: ['username'] },
    })

    const cards = cardData.map((card) => card.get({ plain: true }));
    cards.forEach(card => card.image = card.images.split(', ')[0].slice(1, -1));
    console.log(cards);

    res.render('homepage', {
      cards,
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
          attributes: ['name']
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

    const recipe = recipeData.get({ plain: true });
    recipe.images = recipe.images.split(', ')[0].slice(1, -1);
    recipe.instructions = recipe.instructions.slice(1, -1);
    console.log(recipe);
    res.render('recipe', {
      recipe,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/dashboard', withAuth, async (req, res) => {
  try {

    res.render('dashboard');
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
