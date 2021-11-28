const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
      // console.log(req.session.user.username)
      // console.log(req.session.user.usertype)
      if(req.session.user && req.session.user.usertype === "author"){
        return res.render('users/author_index',{username:req.session.user.username,usertype:req.session.user.usertype})
      }
    } catch (error) {
      res.status(500).json({error:error})
    }
  });

 
  module.exports = router;