const express = require('express');

const router = express.Router();
const data = require('../data');
const bookListData = data.authors;
//display all books here
router.get('/', async (req, res) => {
    try {
      console.log(req.session.user.username)
      console.log(req.session.user.usertype)
      if(req.session.user && req.session.user.usertype == "author"){
        console.log("kamal")
        let list = await bookListData.displayBooks(req.session.user.username)
        //let list = await data.displayBooks("abc")
        // console.log("hello")
       
        //     console.log(list)
   
        return res.render('users/author_index',{  listofbooks: list ,username:req.session.user.username,
          usertype:req.session.user.usertype,
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
  // router.get('/author_create_newbook', async (req, res) => {
  //   try {
  //     if(req.session.user && req.session.user.usertype === "author"){
  //       return res.render('users/author_create_newbook',{username:req.session.user.username,
  //         usertype:req.session.user.usertype,
  //         titleName:'Create new book'})
  //     }
  //     else{
  //       return res.redirect('/')
  //     }
  //   } catch (error) {
  //     res.status(500).json({error:error})
  //   }
  // });

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



  router.get('/author_individual/:id', async (req, res) => {
    try {
      let fileName=req.params.id
      if(req.session.user && req.session.user.usertype === "author"){

        let bookDetailsObj = await bookListData.search_book(fileName)

        return res.render('users/author_individual_book',{username:req.session.user.username,
          bookDetails:bookDetailsObj,
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

