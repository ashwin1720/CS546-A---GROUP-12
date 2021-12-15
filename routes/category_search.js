const express = require('express');

const router = express.Router();
const data = require('../data/customers');
const xss = require('xss');

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
      res.status(500).render('users/error')
    }
  });

  router.get('/:searchTerm', async (req, res) => {
    try {
        if(req.session.user && req.session.user.usertype == "customer"){
          let searchTerm = xss(req.params.searchTerm)
          searchTerm = searchTerm.trim()
          if(typeof(searchTerm)!='string') throw 'Invalid data has been passed.'
            let list = await data.searchCategory(searchTerm)
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