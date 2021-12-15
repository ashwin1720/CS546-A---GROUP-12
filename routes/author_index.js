const express = require('express');

const router = express.Router();
const data = require('../data');
const bookListData = data.authors;
const xss = require('xss');

router.get('/', async (req, res) => {
    try {
      
      if(xss(req.session.user) && xss(req.session.user.usertype) == "author"){
        
        let list = []
        list = await bookListData.displayBooks(xss(req.session.user.username))
        let un = xss(req.session.user.username)
        let utype = xss(req.session.user.usertype)
        if(list[0]==='error'){
          return res.render('users/author_index', {nobooks:true, username:un,
            usertype:utype,
            titleName:'Author Main Page'})
        }
        return res.render('users/author_index',{listofbooks: list ,username:un,
          usertype:utype,
          titleName:'Author Main Page'})
      }
      else{
        return res.redirect('/')
      }
    } catch (error) {
      console.log(error)
      res.redirect('/author_login')
    }
  });

  router.get('/author_individual/:id', async (req, res) => {
    try {
      let fileName=xss(req.params.id)

      let un = req.session.user.username;
      let utype = req.session.user.usertype;
      if(xss(req.session.user) && xss(req.session.user.usertype) === "author"){

        let bookDetailsObj = await bookListData.search_book(fileName)
            console.log(bookDetailsObj)
        return res.render('users/author_individual_book',{username:un,
          bookDetails:bookDetailsObj,
          usertype:utype,
          titleName:'Books'})
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
      if (xss(req.session.user) && xss(req.session.user.usertype) === "author") {
        let toUpdateAuthorDetails = await bookListData.getAuthorDetails(xss(req.session.user.username))
        let un = xss(req.session.user.username)
        let utype = xss(req.session.user.usertype)
        return res.render('users/author_update_personal_details',{username:un,
          usertype:utype,
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
       let un = xss(req.session.user.username)
      let pw = xss(req.body.password)
      let an = xss(req.body.authorName)
       un = un.trim()
       pw = pw.trim()
       an = an.trim()
       //if(!un ||!pw||!an) throw 'Content Missing From Form.'
       if(typeof(un)!='string'|| typeof(pw)!='string'||typeof(an)!='string') throw 'Data not string.'
       let toUpdateAuthorDetails = await bookListData.getAuthorDetails(un)
       if(!an && !pw){
         error.push('Password and name cannot be empty')
         res.status(400).render('users/author_update_personal_details', {errors:error, titleName:'Update' ,hasErrors: true,  authorsDetails:toUpdateAuthorDetails});
         return;
       }
       function hasWhiteSpace(s) {
         return /\s/g.test(s);
        
       }
       if(hasWhiteSpace(an)){
        error.push('Name cannot have spaces')
        return res.status(400).res.render('users/author_update_personal_details', {
          errors: error,
          titleName:'Update',
          hasErrors: true,
          authorsDetails:toUpdateAuthorDetails
          });
      }
      if(hasWhiteSpace(pw)){
        error.push('Password cannot have spaces')
        return res.status(400).res.render('users/author_update_personal_details', {
          errors: error,
          titleName:'Update',
          hasErrors: true,
          authorsDetails:toUpdateAuthorDetails
          });
        }
        const newAuthorDetails = await bookListData.updateAuthorDetails(un,an,pw)
        
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