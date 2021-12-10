const express = require('express');
const router = express.Router();


router.get('/', async (req, res) => {
    try {
      if(req.session.user && req.session.user.usertype === "author"){
          req.session.destroy();
        return res.redirect('/')
      }
    } catch (error) {
      res.status(500).json({error:error})
    }
  });

  module.exports = router;