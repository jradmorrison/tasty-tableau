router = require('express').Router();
const { Macros } = require('../../models');

// ROUTE: /api/macros

// // Get all macros
router.get('/', async (req, res) => {
    try {
        const macroData = await Macros.findAll();

        res.status(200).json(macroData);
    } catch (err) {
        res.status(500).json(err);
    }
});

// // Get macro by ID
router.get('/:id', async (req, res) => {
    try {
        const macroData = await Macros.findbyPk(req.params.id);

        res.status(200).json(macroData);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;