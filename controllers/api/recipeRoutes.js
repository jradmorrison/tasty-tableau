router = require('express').Router();
const { Recipe, Tag, Macros, User } = require('../../models');
const withAuth = require('../../utils/auth');

// ROUTE: /api/recipes

// Get all recipes
router.get('/', async (req, res) => {
  try {
    const recipeData = await Recipe.findAll({
      include: [
        {
          model: Tag,
          through: 'Tag_Through',
        },
        {
          model: Macros,
        },
        {
          model: User,
        },
      ],
    });

    res.status(200).json(recipeData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get recipes by user ID
router.get('/user/:id', async (req, res) => {
  try {
    const recipeData = await Recipe.findAll({
      where: {
        user_id: req.params.id,
      },
    });

    if (!recipeData) {
      res.status(404).json({ message: `No recipes found for user with id: ${id}.` });
      return;
    }

    res.status(200).json(recipeData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get recipe by ID
router.get('/:id', async (req, res) => {
  try {
    const recipeData = await Recipe.findByPk(req.params.id, {
      // include: [
      //   {
      //     model: Tag,
      //     through: 'Tag_Through',
      //   },
      //   {
      //     model: Macros,
      //   },
      //   {
      //     model: User,
      //   },
      // ],
    });


    res.status(200).json(recipeData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Create a new recipe
router.post('/', withAuth, async (req, res) => {
  try {
    let newDate = new Date();

    const recipeData = await Recipe.create({
      name: req.body.name,
      user_id: req.session.user_id,
      date_created: newDate,
      description: req.body.description,
      time_total: req.body.time_total,
    });

    if (!recipeData) {
      res.status(404).json({ message: 'Unable to add recipe!' });
    }

    res.status(200).json(recipeData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
