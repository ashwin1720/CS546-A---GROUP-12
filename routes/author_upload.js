const express = require('express');

const router = express.Router();
//const data = require('../data');
//authorData=data.authors;
const data = require('../data/authors');

const upload = require('express-handlebars')

//router.use(upload())

router.get('/', async (req, res) => {
    try {
        if(!req.session.user && req.session.user.usertype ==="author"){
            return res.render('users/author_login',{titleName:'Author Login'})
          }if(req.session.user && req.session.user.usertype ==="author"){
            return res.render('users/author_upload', {titleName: 'Author Upload'})
          }
          // return res.render('users/author_upload', {titleName: 'Author Upload'})
     
    } catch (error) {
      res.status(500).json({error:error})
    }
  });
router.post('/', async (req, res) => {
    try {

        console.log(req.body)
        let details=req.body;
        console.log(req.body);
        let bookname = details["bookname"]
        let price = details["price"]
        let description = details["description"]
        let category = details["category"]
        let authorname="abc"
        let authorusername = req.session.user.username

        if(req.files){
            //console.log(req.files)
            var file = req.files.file;
            var filename = file.name;
            //filename = filename+authorusername;
            console.log(filename);
            let newfilename = filename.slice(0, -4)
            console.log(newfilename)
            newfilename = newfilename+authorusername+".pdf"
            file.mv('./uploads/'+newfilename, function(err){
                if(err){
                    res.render('users/error')
                }
                else{
                    console.log("Cristiano")
                    let bool = data.createBook(bookname, authorname, authorusername, price, description, category, newfilename)
                    console.log(bool)
                    res.redirect('/author_index')
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

