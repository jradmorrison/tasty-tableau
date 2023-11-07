const router = require('express').Router();
const userRoutes = require('./userRoutes');
const favoritesRoutes = require('./favoritesRoutes');
const ingredientRoutes = require('./ingredientRoutes');
const categoryRoutes = require('./categoryRoutes');
const reviewRoutes = require('./reviewRoutes');
const macroRoutes = require('./macrosRoutes');
const tagRoutes = require('./tagRoutes');


router.use('/users', userRoutes);
router.use('/favorites', favoritesRoutes);
router.use('/ingredients', ingredientRoutes);
router.use('/categories', categoryRoutes);
router.use('/reviews', reviewRoutes);
router.use('/macros', macroRoutes);
router.use('/tags', tagRoutes);

module.exports = router;
