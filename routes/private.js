const express = require('express');

const router = express.Router();
const data = require('../data/users');

router.get('/', async (req, res) => {
    let disp_name = req.session.user.username
        res.render('users/private',{titleName:'Private', name: disp_name})
      
  });
  module.exports = router;