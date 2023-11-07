router = require('express').Router();
const { Recipe } = require('../../models');

// ROUTE: /api/recipes

// Get all recipes
router.get('/', async (req, res) => {
    try {
        const recipeData = await Recipe.findAll();

        res.status(200).json(recipeData);
    } catch (err) {
        res.status(500).json(err);
    }
});

// Get recipe by ID
router.get('/:id', async (req, res) => {
    try {
        const recipeData = await Recipe.findbyPk(req.params.id);

        res.status(200).json(recipeData);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;