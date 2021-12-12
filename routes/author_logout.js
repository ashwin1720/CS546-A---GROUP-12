const express = require('express');

const router = express.Router();
const xss = require('xss');


router.get('/', async (req, res) => {
    try {
      if(xss(req.session.user) && xss(req.session.user.usertype) === "author"){
          req.session.destroy();
        return res.redirect('/')
      }
    } catch (error) {
      res.status(500).json({error:error})
    }
  });

  module.exports = router;