const express = require('express');
const xss = require('xss');
const router = express.Router();
//const data = require('../data');
//authorData=data.authors;
const data = require('../data/authors');

const upload = require('express-handlebars')

var ObjectID = require('mongodb').ObjectID;

var objectId = new ObjectID();

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
        let details=xss(req.body);
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
            newfilename = objectId+".pdf"
            file.mv('./public/uploads/'+newfilename,async function(err){
                if(err){
                    res.render('users/error')
                }
                else{
                    // console.log("Cristiano")
                    let bool = await data.createBook(bookname, authorname, authorusername, price, description, category, newfilename)
                    // console.log(bool)

                    if (req.session.user && req.session.user.usertype === "author") {
                      return res.redirect('/author_index')
                    }
                    // res.redirect('/author_index')
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

