const express = require('express');
const router = express.Router();

const data = require('../data');
const bookListData = data.authors;

//display all books here
router.get('/', async (req, res) => {
    try {
      // console.log(req.session.user.username)
      // console.log(req.session.user.usertype)
      if(req.session.user && req.session.user.usertype === "author"){

        let bookData = await  bookListData.getAllBooksByAuthor(req.session.user.username)


        return res.render('users/author_index',{username:req.session.user.username,
          usertype:req.session.user.usertype,
          bookLists:bookData.info,
          titleName:'Author Main Page'})
      }
      else{
        
        return res.redirect('/')
      }
    } catch (error) {
      console.log(error)
      res.status(500).json({error:error})
    }
  });
  
  //create new book
  router.get('/author_create_newbook', async (req, res) => {
    try {
      if(req.session.user && req.session.user.usertype === "author"){
        return res.render('users/author_create_newbook',{username:req.session.user.username,
          usertype:req.session.user.usertype,
          titleName:'Create new book'})
      }
      else{
        return res.redirect('/')
      }
    } catch (error) {

      res.status(500).json({error:error})
    }
  });

  router.get('/author_update_personal_details', async (req, res) => {
    try {
      if(req.session.user && req.session.user.usertype === "author"){
        return res.render('users/author_update_personal_details',{username:req.session.user.username,
          usertype:req.session.user.usertype,
          titleName:'Update personal details'})
      }
      else{
        return res.redirect('/')
      }
    } catch (error) {
      res.status(500).json({error:error})
    }
  });




  


  
 

 
  module.exports = router;