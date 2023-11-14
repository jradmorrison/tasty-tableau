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

// Add a review
router.post('/:id', async (req, res) => {
    try {
        let newDate = new Date();
        
        const reviewData = await Review.create({
            user_id: req.session.user_id,
            rating: req.body.rating,
            review: req.body.review,
            date_created: newDate,
            recipe_id: req.params.id,
        });

        if (!reviewData) {
            res.status(404).json({ message: 'Unable to add review!' });
        }

        res.status(200).json(reviewData);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;