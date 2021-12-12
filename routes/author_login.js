const express = require('express');

const xss = require('xss');
const router = express.Router();
const usersData = require('../data/authors');

router.get('/', async (req, res) => {
  try {
    if (xss(req.session.user) && xss(req.session.user.usertype) === "author") {
      return res.redirect('/author_index')
    }if(xss(req.session.user) && xss(req.session.user.usertype) === "customer"){
      return res.redirect('/customer_index')
    }
    else{
      return res.render('users/author_login',{
        titleName:'Author Login'
      })
    }
   
  } catch (error) {
    return res.render('users/author_login')
  }
});
 

  router.post('/', async (req, res) => {
   try {
      let requestBody = req.body;
      let error =[]
      let un = xss(req.body.username)
      let pw = xss(req.body.password)
    console.log("Secureeeeeeeeeeeeeeeeeeeeeeeeeeee")
      console.log(un)
      if(!un || !pw){
        error.push('Passowrd or username cannot be empty')
        res.status(400).render('users/author_login', {errors:error, titleName:'Login' ,hasErrors: true,});
        return;
      }

      if(un.length<4){
        error.push('username should be atleast 4 characters')
      
        return res.status(400).render('users/author_login', {
          errors: error,
          titleName:'Login',
          hasErrors: true,
          });
       
      }

      if(hasWhiteSpace(un)){
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
      let usernameLower = un.toLowerCase();

      if (!usernameLower.match(/^[0-9a-z]+$/)){
        error.push('username should be alphanumeric')
        return res.status(400).res.render('users/author_login', {
          errors: error,
          titleName:'Login',
          hasErrors: true,
          });
      
      } 

      if(pw.length<6){
        error.push('password should be atleast 6 characters')
       
        return res.status(400).render('users/author_login', {
          errors: error,
          titleName:'Login',
          hasErrors: true,
          });

        }
        //const {username,password} = requestBody;
        const newUser = await usersData.checkUser(usernameLower,pw)
        if(newUser.authenticated){
          const usertype ="author"
          req.session.user ={username:usernameLower,usertype:usertype,authorName:newUser.authorName};
          return res.redirect('/author_index')
      
        }
    } catch (error) {
      return res.render('users/author_login',{errors:error,hasErrors:true})
    }
  })  
module.exports = router;