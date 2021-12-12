const express = require('express');

const router = express.Router();
const data = require('../data/customers');
const xss = require('xss');

router.get('/', async (req, res) => {
    try {
        if(xss(req.session.user) && xss(req.session.user.usertype) == "customer"){
            let list = await data.index_content()
            list = xss(list)
            un=xss(req.session.user.username)
            utype=xss(reqsession.user.usertype)
            //console.log(list)
            return res.render('users/customer_search',{listofbooks: list ,username:un,
              usertype:utype,
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
        if(xss(req.session.user) && xss(req.session.user.usertype) == "customer"){
            let list = await data.searchBook(xss(req.params.searchTerm))
            list = xss(list)
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