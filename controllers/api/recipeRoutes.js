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
    // console.trace(req.body.user_id);
    const recipeData = await Recipe.findAll({
      where: {
        user_id: req.params.id,
      },
    });

    console.trace(recipeData);

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
    console.log(req.params.id);
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

router.post('/', async (req, res) => {
  try {
    console.trace(req.body.name);
    console.trace(req.body.description);
    console.trace(req.body.date_created);
    console.trace(req.body.user_id);

    // console.trace(req.session.user_id);
    // console.trace(req.body.name);

    // let newDate = new Date();

    const recipeData = await Recipe.create({
      name: req.body.name,
      user_id: req.body.user_id,
      date_created: req.body.date_created,
      description: req.body.description,
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
