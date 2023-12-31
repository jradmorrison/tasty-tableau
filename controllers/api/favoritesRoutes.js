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
    const favoritesData = await Favorite.create({
      recipe_id: req.params.id,
      user_id: req.session.user_id,
    });

    const recipeData = await Recipe.findByPk(req.params.id, {
      include: [
        {
          model: User,
        },
      ],
    });

    let recipe = recipeData.get({ plain: true });

    const recipeName = recipe.name;
    const authorEmail = recipeData.user.email;

    //Send Email to our Email if it's an old user
    let mailOptions = {
      from: process.env.MAILER_EMAIL,
      to: process.env.MAILER_EMAIL,
      subject: 'Recipe Saved',
      text: `${req.session.username} has saved ${recipeData.user.username}'s recipe: ${recipeName}`,
    };

    if (authorEmail != 'NULL') {
      mailOptions = {
        from: process.env.MAILER_EMAIL,
        to: authorEmail,
        subject: 'Recipe Saved',
        text: `Someone has saved your recipe: ${recipeName}`,
      };
    }

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
