router = require('express').Router();
const { Tag_Through } = require('../../models');

// ROUTE: /api/tagthroughs

// GET all tag_throughs
// INCLUDING full recipe and tag names
router.get('/', async (req, res) => {
    try {
        const tagThroughData = await Tag_Through.findAll({
            // include: [
            //     {
            //         model: Recipe,
            //     },
            //     {
            //         model: Tag,
            //     },
            // ],
        });

        res.status(200).json(tagThroughData);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;