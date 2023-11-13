router = require('express').Router();
const { Recipe, Tag, Macros, User, Ingredients_Through, Tag_Through } = require('../../models');
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

    console.trace('TEST 1 ======================');
    const recipeData = await Recipe.create({
      name: req.body.name,
      user_id: req.session.user_id,
      time_total: req.body.time_total,
      date_created: newDate,
      description: req.body.description,
      category_id: req.body.category_id,
      instructions: req.body.instructions,
      rating: 0,
    });
    console.trace('TEST 2 ======================');
    console.trace(req.body.ingredients);
    for (const ing of req.body.ingredients) {
      const ingredientThroughData = await Ingredients_Through.create({
        recipe_id: recipeData.id,
        ingredient_id: ing.ing,
        quantity: ing.quantity,
      });
    }
    console.trace('TEST 3 ======================');
    for (const tag of req.body.tags) {
      const tagThrough = await Tag_Through.create({
        recipe_id: recipeData.id,
        tag_id: tag,
      });
    }

    if (!recipeData) {
      res.status(404).json({ message: 'Unable to add recipe!' });
    }

    res.status(200).json(recipeData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
