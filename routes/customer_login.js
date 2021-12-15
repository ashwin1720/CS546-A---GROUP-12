const express = require('express');

const router = express.Router();
const data = require('../data/customers');
const xss = require('xss');

router.get('/', async (req, res) => {
  try {
    if (xss(req.session.user) && xss(req.session.user.usertype) === "author") {
      return res.redirect('/author_index')
    }if(xss(req.session.user) && xss(req.session.user.usertype) === "customer"){
      return res.redirect('/customer_index')
    }
    else{
      return res.render('users/customer_login',{
        titleName:'Customer Login'
      })
    }
   
  } catch (error) {
    return res.render('users/customer_login',{hasErrors:true, errors:error})
  }
});
 

  router.post('/', async (req, res) => {
   try {
      let error =[]
      let un = xss(req.body.username)
      let pw = xss(req.body.password)
      un = un.trim()
      pw = pw.trim();
      if(typeof(un)!='string'||typeof(pw)!='string') throw 'Invalid Data Has Been Passed.'
      if(!un || !pw){
        error.push('Passowrd or username cannot be empty')
        res.status(400).render('users/customer_login', {errors:error, titleName:'Login' ,hasErrors: true,});
        return;
      }

      if(un.length<4){
        error.push('username should be atleast 4 characters')
      
        return res.status(400).render('customer/author_login', {
          errors: error,
          titleName:'Login',
          hasErrors: true,
          });
       
      }

      if(hasWhiteSpace(un)){
        error.push('username cannot have spaces')
        
        return res.render('users/customer_login', {
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
        return res.status(400).res.render('users/customer_login', {
          errors: error,
          titleName:'Login',
          hasErrors: true,
          });
      
      } 

      if(pw.length<6){
        error.push('password should be atleast 6 characters')
       
        return res.status(400).render('users/customer_login', {
          errors: error,
          titleName:'Login',
          hasErrors: true,
          });

        }
        
        //const {username,password} = requestBody;
        const newUser = await data.checkUser(usernameLower,pw)
        if(newUser.authenticated){
          const usertype ="customer"
          req.session.user ={username:usernameLower,usertype:usertype};
          return res.redirect('/customer_index')
      
        }
        
     
    } catch (error) {
      console.log("Helloooooooo")
      console.log(error)
      return res.render('users/customer_login',{errors:error,hasErrors:true})
    }
  })  
module.exports = router;