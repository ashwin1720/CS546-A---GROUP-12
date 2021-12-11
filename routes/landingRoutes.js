const express = require('express');

const router = express.Router();

router.get('/', async (req, res) => {
    try {
      if (req.session.user && req.session.user.usertype === "author") {
        return res.redirect('/author_index')
      }if(req.session.user && req.session.user.usertype === "customer"){
        return res.redirect('/customer_index')
      }
      else{
        return res.render('users/landing',{
          titleName:'Welcome to online library'
        })
      }
     
    } catch (error) {
      return res.render('users/landing')
    }
  });


  module.exports = router;