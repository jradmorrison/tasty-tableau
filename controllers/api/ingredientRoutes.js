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

// Get Ingredient by name
router.get('/:ingName', async (req, res) => {
    try {
        const ingredientData = await Ingredient.findOne({
            where: {
                name: ingName,
            },
            include: [
                {
                    model: Recipe,
                    through: {
                        model: IngredientsThrough,
                    },
                },
            ],
        });

        res.status(200).json(ingredientData);
    } catch (err) {
        res.status(500).json(err);
    }
});


module.exports = router;