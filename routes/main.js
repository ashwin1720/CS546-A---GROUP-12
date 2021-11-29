const express = require('express');

const router = express.Router();


  router.get('/', async (req, res) => {
    if (req.session.user) {
        res.redirect('/private');
      } else {
        res.render('users/landing',{titleName:'Landing'})
      }
  });
  module.exports = router;