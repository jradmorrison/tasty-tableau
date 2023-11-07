router = require('express').Router();
const { Recipe, CategoryThrough } = require('../../models');

// ROUTE: /api/recipes

// Get all recipes
router.get('/', async (req, res) => {
    try {
        const recipeData = await Recipe.findAll({
            // include: [
            //     {
            //         model: Category,
            //         through: {
            //             model: CategoryThrough,
            //         }
            //     },
            //     {
            //         model: Tag,
            //         through: {
            //             model: CategoryThrough,
            //         },
            //     },
            //     {
            //         model: Macro,
            //     },
            //     {
            //         model: User,
            //     },
            //     {
            //         model: Review,
            //     },
            // ],
    });

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

// Get recipes by user ID
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
        };

        res.status(200).json(recipeData);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;