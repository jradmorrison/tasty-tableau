router = require('express').Router();
const { Recipe, Review } = require('../../models');

// ROUTE: /api/reviews

// Get all reviews
router.get('/', async (req, res) => {
    try {
        const reviewData = await Review.findAll({
            include: [
                {
                    model: Recipe,
                },
            ],
        });

        res.status(200).json(reviewData);
    } catch (err) {
        res.status(500).json(err);
    }
});

// Get review by ID
router.get('/:id', async (req, res) => {
    try {
        const reviewData = await Review.findbyPk(req.params.id, {
            include: [
                {
                    model: Recipe,
                },
            ],
        });

        res.status(200).json(reviewData);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;