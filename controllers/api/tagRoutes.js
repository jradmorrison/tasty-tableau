router = require('express').Router();
const { Tag } = require('../../models');

// ROUTE: /api/tags

// Get all tags
router.get('/', async (req, res) => {
    try {
        const tagData = await Tag.findAll({
            include: [
                {
                    model: Recipe,
                    through: {
                        model: Tag_Through,
                    },
                },
            ],
        });

        res.status(200).json(tagData);
    } catch (err) {
        res.status(500).json(err);
    }
});

// Get tag by ID
router.get('/:id', async (req, res) => {
    try {
        const recipeData = await Recipe.findbyPk(req.params.id, {
            include: [
                {
                    model: Recipe,
                    through: {
                        model: Tag_Through,
                    },
                },
            ],
        });

        res.status(200).json(recipeData);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;