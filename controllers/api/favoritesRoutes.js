router = require('express').Router();
const { Favorite } = require('../../models');

// ROUTE: /api/favorites

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

// POST a new favorite
router.post('/user/:id', async (req, res) => {
    try {
        console.trace(req.params.id);
        console.trace(req.session.user_id);
        const favoritesData = await Favorite.create({
            recipe_id: req.params.id,
            user_id: req.session.user_id,
        });

        res.status(200).json(favoritesData);
    } catch (err) {
        res.status(500).json(err);
    }
})

module.exports = router;