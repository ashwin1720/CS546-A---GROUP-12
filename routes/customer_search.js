const express = require('express');

const router = express.Router();
const data = require('../data/customers');

router.get('/', async (req, res) => {
    try {
        if(req.session.user && req.session.user.usertype == "customer"){
            let list = await data.index_content()
            console.log(list)
            return res.render('users/customer_search',{listofbooks: list ,username:req.session.user.username,
              usertype:req.session.user.usertype,
              titleName:'Customer Main Page'})
          }
          else{
            return res.redirect('/')
          }
    } catch (error) {
      res.status(500).json({error:error})
    }
  });

  router.get('/:searchTerm', async (req, res) => {
    try {
        if(req.session.user && req.session.user.usertype == "customer"){
            let list = await data.searchBook(req.params.searchTerm)
            console.log(list)
            return res.json(list)
          }
          else{
            return res.redirect('/')
          }
    } catch (error) {
      res.status(500).json({error:error})
    }
  });
  module.exports = router;