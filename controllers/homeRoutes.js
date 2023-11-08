const router = require('express').Router();
const {  } = require('../models');
const withAuth = require('../utils/auth');

// ROUTE: /

// GET ROUTES for all views
// Home
router.get('/', async (req, res) => {
  try {
    
    res.render('homepage');
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/dashboard', withAuth, async (req, res) => {
  try {
    
    res.render('dashboard');
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/about', async (req, res) => {
  try {
    res.render('about');
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/team', async (req, res) => {
  try {
    
    res.render('team');
  } catch (err) {
    res.status(500).json(err);
  }
});






// Login form
router.get('/login', (req, res) => {
  if (req.session.logged_in) {
    res.redirect('/dashboard');
    return;
  }
  res.render('login');
});

// Signup form
router.get('/signup', (req, res) => {
  if (req.session.logged_in) {
    res.redirect('/dashboard');
    return;
  }
  res.render('signup');
});

module.exports = router;
