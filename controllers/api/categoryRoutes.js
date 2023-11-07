router = require('express').Router();
const { Category } = require('../../models');

// ROUTE: /api/categories

// Get all Categories
router.get('/', async (req, res) => {
    try {
        const categoryData = await Category.findAll();

        res.status(200).json(categoryData);
    } catch (err) {
        res.status(500).json(err);
    }
});

// Get Category by name
router.get('/:catName', async (req, res) => {
    try {
        const categoryData = await Category.findOne({
            where: {
                name: catName,
            },
        });

        res.status(200).json(categoryData);
    } catch (err) {
        res.status(500).json(err);
    }
});



module.exports = router;