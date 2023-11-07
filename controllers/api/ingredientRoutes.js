router = require('express').Router();
const { Ingredient } = require('../../models');

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

// Get Ingredient by name
router.get('/:ingName', async (req, res) => {
    try {
        const ingredientData = await Ingredient.findOne({
            where: {
                name: ingName,
            },
            include: [
                {
                    model: Ingredient,
                },
                {
                    model: Recipe,
                },
            ],
        });

        res.status(200).json(ingredientData);
    } catch (err) {
        res.status(500).json(err);
    }
});


module.exports = router;