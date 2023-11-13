router = require('express').Router();
const { Recipe, Tag, Macros, User, Ingredients_Through, Tag_Through, Ingredient, Category } = require('../../models');
const withAuth = require('../../utils/auth');

// ROUTE: /api/recipes

// Get all recipes
router.get('/', async (req, res) => {
  try {
    const recipeData = await Recipe.findAll({
      include: [
        {
          model: Tag,
          through: 'Tag_Through',
        },
        {
          model: Macros,
        },
        {
          model: User,
        },
      ],
    });

    res.status(200).json(recipeData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get recipes by user ID
router.get('/user/:id', async (req, res) => {
  try {
    const recipeData = await Recipe.findAll({
      where: {
        user_id: req.params.id,
      },
    });

    if (!recipeData) {
      res.status(404).json({ message: `No recipes found for user with id: ${id}.` });
      return;
    }

    res.status(200).json(recipeData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// router.get('/edit/:id', async (req, res) => {
//   try {
//     const recipeData = await Recipe.findAll({
//       where: {
//         user_id: req.params.id,
//       },
//     });

//     if (!recipeData) {
//       res.status(404).json({ message: `No recipes found for user with id: ${id}.` });
//       return;
//     }

//     res.status(200).json(recipeData);
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });

// Get recipe by ID
router.get('/:id', async (req, res) => {
  try {
    const recipeData = await Recipe.findByPk(req.params.id, {});

    res.status(200).json(recipeData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.put('/:id', withAuth, async (req, res) => {
  try {
    console.trace('TEST 1 =============================');
    const updatedRecipeData = await Recipe.update(
      {
        name: req.body.name,
        user_id: req.session.user_id,
        time_total: req.body.time_total,
        description: req.body.description,
        category_id: req.body.category_id,
        instructions: req.body.instructions,
      },
      {
        where: {
          id: req.params.id,
        },
      }
    );
    console.trace('TEST 2 =============================');
    const removeIngredientThrough = await Ingredients_Through.destroy({
      where: {
        recipe_id: req.params.id,
      },
    });
    console.trace('TEST 3 =============================');
    const createIngredientThrough = req.body.ingredients.map(async (ing) => {
      await Ingredients_Through.create({
        recipe_id: req.params.id,
        ingredient_id: ing.ing,
        quantity: ing.quantity,
      });
    });
    console.trace('TEST 4 =============================');
    const removeTags = await Tag_Through.destroy({
      where: {
        recipe_id: req.params.id,
      },
    });
    console.trace('TEST 5 =============================');
    console.log(req.params.id);
    console.log(req.body.tags);

    const createTagThrough = req.body.tags.map(async (tag) => {
      console.log(tag);
      await Tag_Through.create({
        recipe_id: req.params.id,
        tag_id: tag,
      });
    });

    console.trace('TEST 6 =============================');
    res.status(200).json(updatedRecipeData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/edit/:id', async (req, res) => {
  try {
    const recipeData = await Recipe.findByPk(req.params.id, {
      include: [
        {
          model: Tag,
          through: 'Tag_Through',
        },
      ],
    });
    const recipe = recipeData.get({ plain: true });

    const ingredientThroughData = await Ingredients_Through.findAll({
      where: {
        recipe_id: req.params.id,
      },
      include: [
        {
          model: Ingredient,
        },
      ],
    });
    const recipeIngredients = ingredientThroughData.map((data) => data.get({ plain: true }));

    const categoryData = await Category.findAll();
    let categories = categoryData.map((recipe) => recipe.get({ plain: true }));
    categories.sort((a, b) => (a.name < b.name ? -1 : 1));
    categories = categories.slice(4);

    const ingredientData = await Ingredient.findAll();
    let ingredients = ingredientData.map((ing) => ing.get({ plain: true }));
    ingredients.sort((a, b) => (a.name < b.name ? -1 : 1));
    ingredients = ingredients.slice(1);

    const tagData = await Tag.findAll();
    const tags = tagData.map((tag) => tag.get({ plain: true }));
    tags.sort((a, b) => (a.name < b.name ? -1 : 1));

    res.render('edit-recipe', {
      recipe,
      recipeIngredients,
      categories,
      ingredients,
      tags,
      logged_in: req.session.logged_in,
      user: req.session.username,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});
// Create a new recipe
router.post('/', withAuth, async (req, res) => {
  try {
    let newDate = new Date();

    console.trace('TEST 1 ======================');
    const recipeData = await Recipe.create({
      name: req.body.name,
      user_id: req.session.user_id,
      time_total: req.body.time_total,
      date_created: newDate,
      description: req.body.description,
      category_id: req.body.category_id,
      instructions: req.body.instructions,
      rating: 0,
    });
    console.trace('TEST 2 ======================');
    console.trace(req.body.ingredients);
    for (const ing of req.body.ingredients) {
      const ingredientThroughData = await Ingredients_Through.create({
        recipe_id: recipeData.id,
        ingredient_id: ing.ing,
        quantity: ing.quantity,
      });
    }
    console.trace('TEST 3 ======================');
    for (const tag of req.body.tags) {
      const tagThrough = await Tag_Through.create({
        recipe_id: recipeData.id,
        tag_id: tag,
      });
    }

    if (!recipeData) {
      res.status(404).json({ message: 'Unable to add recipe!' });
    }

    res.status(200).json(recipeData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
