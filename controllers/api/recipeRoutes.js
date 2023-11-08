router = require('express').Router();
const { Recipe, Tag, Macros, User } = require('../../models');

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
    }
});

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