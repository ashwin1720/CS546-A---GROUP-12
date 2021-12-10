const express = require('express');

const router = express.Router();
const data = require('../data/users');
//const usersData = data.users;

router.get('/', async (req, res) => {
    req.session.destroy();
    res.render('users/logout')
  });
  
  module.exports = router;