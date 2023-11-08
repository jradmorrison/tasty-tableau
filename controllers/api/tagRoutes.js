router = require('express').Router();
const { Tag } = require('../../models');

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

        res.status(200).json(recipeData);
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