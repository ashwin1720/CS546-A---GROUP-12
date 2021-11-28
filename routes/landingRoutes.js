const express = require('express');
const router = express.Router();
// const bcrypt = require('bcryptjs');
// const userData = require('../data/users');
// const saltRounds = 16;

router.get('/', async (req, res) => {
    try {
       return res.render('users/landing')
     
    } catch (error) {
      res.status(500).json({error:error})
    }
  });

  module.exports = router;