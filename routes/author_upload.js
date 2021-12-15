const express = require('express');

const xss = require('xss');
const router = express.Router();
const data = require('../data/authors');
const { ObjectId, ObjectID } = require('bson');
router.get('/', async (req, res) => {
    try {
        if(!xss(req.session.user) && xss(req.session.user.usertype) ==="author"){
            return res.render('users/author_login',{titleName:'Author Login'})
          }if(xss(req.session.user) && xss(req.session.user.usertype) ==="author"){
            return res.render('users/author_upload', {titleName: 'Author Upload'})
          }
     
    } catch (error) {
      res.status(500).render('users/error')
    }
  });
router.post('/', async (req, res) => {
    try {
        let bookname = xss(req.body.bookname.trim())
        let price = xss(req.body.price)
        let description = xss(req.body.description.trim())
        let category = xss(req.body.category.trim())
        let authorname=xss(req.session.user.authorName.trim());
        let authorusername = xss(req.session.user.username.trim())
        if(!bookname || !authorname || !authorusername || !description || !category) throw 'Invalid data has been passed.'
    if(typeof(bookname)!='string'|| typeof(authorname)!='string'|| typeof(authorusername)!='string'|| typeof(description)!='string'|| typeof(category)!='string') throw 'Invalid data has been passed.'

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
      res.status(500).render('users/author_upload', {hasErrors:true, errors:e});
      return;
    
    }

  });

  module.exports = router;

