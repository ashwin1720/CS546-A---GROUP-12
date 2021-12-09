const express = require('express');

const router = express.Router();
const data = require('../data/customers');
//const usersData = data.users;

router.get('/', async (req, res) => {
    try {
        if(req.session.user && req.session.user.usertype == "customer"){
            console.log("Inside routes")
            console.log(req.session.user.username)
            console.log(req.session.user.usertype)
            let list = await data.index_content()
            console.log(list)
            return res.render('users/customer_index',{listofbooks: list ,username:req.session.user.username,
              usertype:req.session.user.usertype,
              titleName:'Customer Main Page'})
          }
          else{
            return res.redirect('/')
          }
       //return res.render('users/customer_index')
     
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