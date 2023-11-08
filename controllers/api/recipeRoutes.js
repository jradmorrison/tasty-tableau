router = require('express').Router();
const { Recipe, Tag, Macros, User } = require('../../models');

// ROUTE: /api/recipes

// Get all recipes
router.get('/', async (req, res) => {
<<<<<<< HEAD
  try {
    const recipeData = await Recipe.findAll();

    res.status(200).json(recipeData);
  } catch (err) {
    res.status(500).json(err);
  }
  res.status(200).json(recipeData);
});

// Get recipe by ID
router.get('/:id', async (req, res) => {
  try {
    const recipeData = await Recipe.findbyPk(req.params.id);
=======
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
>>>>>>> b6cc71d6d7e37ab1b2f615a0ebd3a90f7857ee56

    res.status(200).json(recipeData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get recipes by user ID
<<<<<<< HEAD
router.get('/:id', async (req, res) => {
  try {
    const recipeData = await Recipe.findAll({
      where: {
        user_id: req.params.id,
      },
    });

    if (!recipeData) {
      res.status(404).json({ message: `No recipes found for user with id: ${id}.` });
      return;
=======
router.get('/user', async (req, res) => {
    try {
        // console.trace(req.body.user_id);
        const recipeData = await Recipe.findAll({
            where: {
                user_id: req.body.user_id,
            },
        });

        console.trace(recipeData);

        if (!recipeData) {
            res.status(404).json({ message: `No recipes found for user with id: ${id}.` });
            return;
        };

        res.status(200).json(recipeData);
    } catch (err) {
        res.status(500).json(err);
>>>>>>> b6cc71d6d7e37ab1b2f615a0ebd3a90f7857ee56
    }
    if (!recipeData) {
      res.status(404).json({ message: `No recipes found for user with id: ${id}.` });
      return;
    }

    res.status(200).json(recipeData);
  } catch (err) {
    res.status(500).json(err);
  }
});

<<<<<<< HEAD
module.exports = router;
=======
// Get recipe by ID
router.get('/:id', async (req, res) => {
    try {
        console.trace(req.params.id);
        const recipeData = await Recipe.findByPk(req.params.id, {
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



module.exports = router;
>>>>>>> b6cc71d6d7e37ab1b2f615a0ebd3a90f7857ee56
