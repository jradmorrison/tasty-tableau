router = require('express').Router();
const { Favorite } = require('../../models');

// ROUTE: /api/recipes

// Get favorites by user ID
router.get('/:id', async (req, res) => {
    try {
        const favoritesData = await Favorite.findAll({
            where: {
                user_id: req.params.id,
            },
        });

        if(!favoritesData) {
            res.status(404).json({ message: `No favorites found for user with id: ${id}.`});
            return;
        };

        res.status(200).json(favoritesData);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;