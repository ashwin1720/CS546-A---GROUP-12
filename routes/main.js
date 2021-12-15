const express = require('express');

const router = express.Router();

const xss = require('xss');
  router.get('/', async (req, res) => {
    if (xss(req.session.user)) {
        res.redirect('/private');
      } else {
        res.render('users/landing',{titleName:'Landing'})
      }
  });
  module.exports = router;