const express = require('express');

const router = express.Router();
const data = require('../data/users');
//const usersData = data.users;

  router.get('/', async (req, res) => {
    if (req.session.user) {
        res.redirect('/private');
      } else {
        res.render('users/login',{titleName:'Login'})
      }
  });
  module.exports = router;