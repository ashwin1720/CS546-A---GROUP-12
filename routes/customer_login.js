const express = require('express');

const router = express.Router();
// const data = require('../data/customers');
//const usersData = data.users;

router.get('/', async (req, res) => {
    try {
       return res.render('users/customer_login')
     
    } catch (error) {
      res.status(500).json({error:error})
    }
  });

module.exports = router;
