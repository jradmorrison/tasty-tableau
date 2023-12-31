router = require('express').Router();
const { Tag, Recipe, Tag_Through, Category } = require('../../models');
const { Op } = require('sequelize');

// ROUTE: /api/tags

// Get all tags
router.get('/', async (req, res) => {
  try {
    const tagData = await Tag.findAll();

    res.status(200).json(tagData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get tag by ID
router.get('/:id', async (req, res) => {
  try {
    const tagData = await Tag.findbyPk(req.params.id);

    res.status(200).json(tagData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Returns all recipes that have 'text' in their name,
// category, or description
router.get('/search/:text', async (req, res) => {
  try {
    const categoryQuery = await Category.findAll({
      attributes: ['id'],
      where: {
        name: {
          [Op.like]: `%${req.params.text}%`,
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
                  [Op.like]: `%${req.params.text}%`,
                },
              },
              {
                name: {
                  [Op.like]: `%${req.params.text}%`,
                },
              },
            ],
          },
        ],
      },
    });

    const recipes = await recipeQuery.map((rec) => rec.get({ plain: true }));

    // Grabs the first image and creates a new attribute for it
    recipes.forEach((recipe) => {
      recipe.image = recipe.images.split(', ')[0].slice(1);
      if (recipe.image.charAt(recipe.image.length - 1) === ']') {
        recipe.image = recipe.image.slice(0, recipe.image.length - 1);
      }
    });

    res.status(200).json(recipes);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Create a new tag
router.post('/', async (req, res) => {
  try {
    const tagData = await Tag.create({
      name: req.body.name,
    });
    res.status(200).json(tagData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
