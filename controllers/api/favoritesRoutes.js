router = require('express').Router();
require('dotenv').config();
const nodemailer = require('nodemailer');
const { Favorite, Recipe, User } = require('../../models');
const session = require('express-session');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAILER_EMAIL,
    pass: process.env.MAILER_PASSWORD,
  },
});

// ROUTE: /api/favorites

// Get favorites by user ID
router.get('/:id', async (req, res) => {
  try {
    const favoritesData = await Favorite.findAll({
      where: {
        user_id: req.params.id,
      },
    });

    if (!favoritesData) {
      res.status(404).json({ message: `No favorites found for user with id: ${id}.` });
      return;
    }

    res.status(200).json(favoritesData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// POST a new favorite
router.post('/user/:id', async (req, res) => {
  try {
    console.trace('TEST ============================');
    const favoritesData = await Favorite.create({
      recipe_id: req.params.id,
      user_id: req.session.user_id,
    });
    console.trace('TEST ============================');
    const recipeData = await Recipe.findByPk(req.params.id, {
      include: [
        {
          model: User,
        },
      ],
    });

    let recipe = recipeData.get({ plain: true });

    console.trace('TEST ============================');
    console.trace(recipe);
    const recipeName = recipe.name;
    const authorEmail = recipeData.user.email;

    let mailOptions = {
      from: process.env.MAILER_EMAIL,
      to: process.env.MAILER_EMAIL,
      subject: 'Recipe Favorited',
      text: `${req.session.username} has favorited ${recipeData.user.username}'s recipe: ${recipeName}`,
    };

    if (authorEmail != 'NULL') {
      //NODE MAILER
      mailOptions = {
        from: process.env.MAILER_EMAIL,
        to: authorEmail,
        subject: 'Recipe Favorited',
        text: `Someone has favorited your recipe: ${recipeName}`,
      };
    }

    console.trace(mailOptions);
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        return console.error('Error', err);
      }
      console.log('Email send:', info.response);
    });

    res.status(200).json(favoritesData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// DELETE a new favorite
router.delete('/user/:id', async (req, res) => {
  try {
    const favoritesData = await Favorite.destroy({
      where: {
        recipe_id: req.params.id,
        user_id: req.session.user_id,
      },
    });

    res.status(200).json(favoritesData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
