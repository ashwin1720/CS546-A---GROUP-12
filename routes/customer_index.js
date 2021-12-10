const express = require('express');

const router = express.Router();
// const data = require('../data/customers');
//const usersData = data.users;

router.get('/', async (req, res) => {
    try {
       return res.render('users/customer_index')
     
    } catch (error) {
      res.status(500).json({error:error})
    }
  });

  router.get('/indiviual_book_page/:id', async (req, res) => {
    try {
       return res.render('users/customer_index')
       //Should call check_bought and if not bought enable only read samlpe button.
     
    } catch (error) {
      res.status(500).json({error:error})
    }
  });

module.exports = router;