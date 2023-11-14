router = require('express').Router();
const { Ingredient, IngredientsThrough } = require('../../models');

// ROUTE: /api/ingredients

// Get all ingredients
router.get('/', async (req, res) => {
  try {
    const ingredientData = await Ingredient.findAll();

    res.status(200).json(ingredientData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET ingredient by ID
router.get('/:id', async (req, res) => {
  try {
    const ingredientData = await Ingredient.findByPk();

    res.status(200).json(ingredientData);
  } catch (err) {
    res.status(500).json(err);
  }
});
module.exports = router;
