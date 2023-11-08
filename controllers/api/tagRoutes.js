router = require('express').Router();
const { Tag } = require('../../models');

// ROUTE: /api/tags

// Get all tags
router.get('/', async (req, res) => {
    try {
        const tagData = await Tag.findAll();

        console.trace(tagData);

        res.status(200).json(tagData);
    } catch (err) {
        res.status(500).json(err);
    }
});

router.get('/search/:tag', async (req, res) => {
    try {
        const tagsData = await Tag.findAll({
            where: {
              [Op.or]: [
                {
                  name: {
                    [Op.like]: `%${req.params.tag}%`,
                  }
                },
              ]
            },
            include: {
              model: Recipe,
              through: Tag_Through
            }
          });
      
          console.trace(tagsData[0].recipes);
          const tagRecipes = tagsData[0].recipes.map(rec =>
            rec.get({ plain: true })
          );
          console.trace(tagRecipes);

          res.status(200).json(tagRecipes);
    } catch (err) {
        res.status(500).json(err);
    }
})

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