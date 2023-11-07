const router = require('express').Router();
const userRoutes = require('./userRoutes');
const favoritesRoutes = require('./favoritesRoutes');
const ingredientRoutes = require('./ingredientRoutes');
const categoryRoutes = require('./categoryRoutes');


router.use('/users', userRoutes);
router.use('/favorites', favoritesRoutes);
router.use('/ingredients', ingredientRoutes);
router.use('/categories', categoryRoutes);

module.exports = router;
