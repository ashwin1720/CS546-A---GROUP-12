const express = require('express');

const router = express.Router();
const data = require('../data');
const bookListData = data.authors;
//display all books here
router.get('/', async (req, res) => {
    try {
      
      if(req.session.user && req.session.user.usertype == "author"){
        
        let list = await bookListData.displayBooks(req.session.user.username)
        
   
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

        console.log("outside")
        console.log(req.session.user.username)

        let toUpdateAuthorDetails = await bookListData.getAuthorDetails(req.session.user.username)
        console.log(toUpdateAuthorDetails)
        return res.render('users/author_update_personal_details',{username:req.session.user.username,
          usertype:req.session.user.usertype,
          authorsDetails:toUpdateAuthorDetails,
          titleName:'Update personal details'})
      }
     
    } catch (error) {
      return res.render('users/author_login')
    }
  });

  router.post('/', async (req, res) => {
    try {
       let requestBody = xss(req.body);
       let error =[]
 
       if(!requestBody.username || !requestBody.password){
         error.push('Passowrd or username cannot be empty')
         res.status(400).render('users/author_login', {errors:error, titleName:'Login' ,hasErrors: true,});
         return;
       }
 
       if(requestBody.username.length<4){
         error.push('username should be atleast 4 characters')
       
         return res.status(400).render('users/author_login', {
           errors: error,
           titleName:'Login',
           hasErrors: true,
           });
        
       }
 
       if(hasWhiteSpace(requestBody.username)){
         error.push('username cannot have spaces')
         
         return res.render('users/author_login', {
           errors: error,
           titleName:'Login',
           hasErrors: true,
           });
         
       } 
 
       function hasWhiteSpace(s) {
         return /\s/g.test(s);
        
       }
 
       let usernameLower = requestBody.username.toLowerCase();
 
       if (!usernameLower.match(/^[0-9a-z]+$/)){
         error.push('username should be alphanumeric')
         return res.status(400).res.render('users/author_login', {
           errors: error,
           titleName:'Login',
           hasErrors: true,
           });
       
       } 
 
       if(requestBody.password.length<6){
         error.push('password should be atleast 6 characters')
        
         return res.status(400).render('users/author_login', {
           errors: error,
           titleName:'Login',
           hasErrors: true,
           });
 
         }
         
         const {username,authorName,password} = requestBody;
         
        const newAuthorDetails = await bookListData.updateAuthorDetails(req.session.user.username,username,authorName,password)
        
         if(newAuthorDetails.authenticated){
          req.session.destroy();
           return res.redirect('/author_login')
       
         }
         
      
     } catch (error) {
       return res.render('users/author_login',{errors:error,hasErrors:true})
     }
   })  


  module.exports = router;

