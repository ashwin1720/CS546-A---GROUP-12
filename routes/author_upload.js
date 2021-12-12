const express = require('express');

const xss = require('xss');
const router = express.Router();
const data = require('../data/authors');

const upload = require('express-handlebars')
const { ObjectID } = require('bson');

router.get('/', async (req, res) => {
    try {
        if(!xss(req.session.user) && xss(req.session.user.usertype) ==="author"){
            return res.render('users/author_login',{titleName:'Author Login'})
          }if(xss(req.session.user) && xss(req.session.user.usertype) ==="author"){
            return res.render('users/author_upload', {titleName: 'Author Upload'})
          }
     
    } catch (error) {
      res.status(500).json({error:error})
    }
  });
router.post('/', async (req, res) => {
    try {

        //console.log(req.body)
        let details=req.body;
        //console.log(req.body);
        let bookname = xss(req.body.bookname)
        let price = xss(req.body.price)
        let description = xss(req.body.description)
        let category = xss(req.body.category)
        let authorname=xss(req.session.user.authorName);
        let authorusername = xss(req.session.user.username)

        if(req.files){
            var file = req.files.file;
            var objectId = new ObjectID();

            newfilename = objectId+".pdf"
            newfilename=xss(newfilename)
            file.mv('./public/uploads/'+newfilename,async function(err){
                if(err){
                    res.render('users/error')
                }
                else{
                    let bool = await data.createBook(bookname, authorname, authorusername, price, description, category, newfilename)

                    if (xss(req.session.user) && xss(req.session.user.usertype) === "author") {
                      return res.redirect('/author_index')
                    }
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

