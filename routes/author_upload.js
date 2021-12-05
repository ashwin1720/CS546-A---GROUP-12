const express = require('express');

const router = express.Router();
const data = require('../data/authors');

const upload = require('express-handlebars')

//router.use(upload())

router.get('/', async (req, res) => {
    try {
        // if(!req.session.user){
        //     return res.render('users/author_signup',{titleName:'Author Signup'})
        //   }if(req.session.user && req.session.user.usertype ==="author"){
        //     return res.render('users/author_upload',{titleName:'Author Main Page'})
        //   }
       return res.render('users/author_upload')
     
    } catch (error) {
      res.status(500).json({error:error})
    }
  });
router.post('/', async (req, res) => {
    try {
        
        if(req.files){

            //console.log(req.files)
            var file = req.files.file;
            var filename = file.name;
            console.log(filename);
            file.mv('./uploads/'+filename, function(err){
                if(err){
                    res.render('user/error')
                }
                else{
                    alert('Book Uploaded Successfully')
                }
            })
        }
        
    } catch (e) {
      console.log(e)
      res.status(500).render('users/error');
      return;
    
    }

  });


  module.exports = router;

