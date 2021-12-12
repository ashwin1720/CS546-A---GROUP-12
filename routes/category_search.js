const express = require('express');

const router = express.Router();
const data = require('../data/customers');

router.get('/', async (req, res) => {
    try {
        if(req.session.user && req.session.user.usertype == "customer"){
            let list = await data.index_content()
            console.log(list)
            return res.render('users/search_by_category',{listofbooks: list ,username:req.session.user.username,
              usertype:req.session.user.usertype,
              titleName:'Customer Main Page'})
          }
          else{
            return res.redirect('/')
          }
    } catch (error) {
      console.log(error)
      res.status(500).json({error:error})
    }
  });

  router.get('/:searchTerm', async (req, res) => {
    try {
        if(req.session.user && req.session.user.usertype == "customer"){
            let list = await data.searchCategory(req.params.searchTerm)
            console.log(list)
            return res.json(list)
          }
          else{
            return res.redirect('/')
          }
    } catch (error) {
      res.render('users/search_by_category',{error: error, hasErrors:true})
    }
  });
  
  module.exports = router;