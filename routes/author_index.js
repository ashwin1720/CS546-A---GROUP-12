const { Console } = require('console');
const express = require('express');

const router = express.Router();
const data = require('../data');
const bookListData = data.authors;
const alert = require('alert')
//display all books here
router.get('/', async (req, res) => {
    try {
      
      if(req.session.user && req.session.user.usertype == "author"){
        
        let list = []
        list = await bookListData.displayBooks(req.session.user.username)
        
        //console.log(list[0])
        if(list[0]==='error'){
          return res.render('users/author_index', {nobooks:true, username:req.session.user.username,
            usertype:req.session.user.usertype,
            titleName:'Author Main Page'})
        }
        return res.render('users/author_index',{listofbooks: list ,username:req.session.user.username,
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



  router.get('/author_update_personal_details', async (req, res) => {
    
    try {
      if (req.session.user && req.session.user.usertype === "author") {
        let toUpdateAuthorDetails = await bookListData.getAuthorDetails(req.session.user.username)
        console.log(toUpdateAuthorDetails)
        return res.render('users/author_update_personal_details',{username:req.session.user.username,
          usertype:req.session.user.usertype,
          authorsDetails:toUpdateAuthorDetails,
          titleName:'Update personal details'})
      }
     
    } catch (error) {
      console.log(error)
      return res.render('users/author_login')
    }
  });

  router.post('/author_update_personal_details', async (req, res) => {
    try {
       let requestBody = req.body;
       let error =[]
       console.log(req.session)
       let toUpdateAuthorDetails = await bookListData.getAuthorDetails(req.session.user.username)
       if(!requestBody.authorName && !requestBody.password){
         error.push('Password and name cannot be empty')
         res.status(400).render('users/author_update_personal_details', {errors:error, titleName:'Update' ,hasErrors: true,  authorsDetails:toUpdateAuthorDetails});
         return;
       }
       function hasWhiteSpace(s) {
         return /\s/g.test(s);
        
       }
       if(hasWhiteSpace(requestBody.authorName)){
        error.push('Name cannot have spaces')
        return res.status(400).res.render('users/author_update_personal_details', {
          errors: error,
          titleName:'Update',
          hasErrors: true,
          authorsDetails:toUpdateAuthorDetails
          });
      }
      if(hasWhiteSpace(requestBody.password)){
        error.push('Password cannot have spaces')
        return res.status(400).res.render('users/author_update_personal_details', {
          errors: error,
          titleName:'Update',
          hasErrors: true,
          authorsDetails:toUpdateAuthorDetails
          });
      }         
         const {authorName,password} = requestBody;
         
        const newAuthorDetails = await bookListData.updateAuthorDetails(req.session.user.username,authorName,password)
        
         if(newAuthorDetails.authenticated){
          req.session.destroy();
          return res.render('users/logged_out')
         }
     } catch (error) {
       console.log(error)
       return res.status(400).render('users/author_update_personal_details',{errors:error,hasErrors:true, authorsDetails:toUpdateAuthorDetails})
     }
   })  

  module.exports = router;