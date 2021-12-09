const express = require('express');

const router = express.Router();
const data = require('../data/customers');
//const usersData = data.users;

router.get('/', async (req, res) => {
  try {
    if (req.session.user && req.session.user.usertype === "author") {
      return res.redirect('/author_index')
    }if(req.session.user && req.session.user.usertype === "customer"){
      return res.redirect('/customer_index')
    }
    else{
      return res.render('users/customer_login',{
        titleName:'Customer Login'
      })
    }
   
  } catch (error) {
    return res.render('users/customer_login')
  }
});
 

  router.post('/', async (req, res) => {
   try {
      let requestBody = req.body;
      let error =[]

      if(!requestBody.username || !requestBody.password){
        error.push('Passowrd or username cannot be empty')
        res.status(400).render('users/customer_login', {errors:error, titleName:'Login' ,hasErrors: true,});
        return;
      }

      if(requestBody.username.length<4){
        error.push('username should be atleast 4 characters')
      
        return res.status(400).render('customer/author_login', {
          errors: error,
          titleName:'Login',
          hasErrors: true,
          });
       
      }

      if(hasWhiteSpace(requestBody.username)){
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

      let usernameLower = requestBody.username.toLowerCase();

      if (!usernameLower.match(/^[0-9a-z]+$/)){
        error.push('username should be alphanumeric')
        return res.status(400).res.render('users/customer_login', {
          errors: error,
          titleName:'Login',
          hasErrors: true,
          });
      
      } 

      if(requestBody.password.length<6){
        error.push('password should be atleast 6 characters')
       
        return res.status(400).render('users/customer_login', {
          errors: error,
          titleName:'Login',
          hasErrors: true,
          });

        }
        
        const {username,password} = requestBody;
        console.log("hello")
        const newUser = await data.checkUser(username,password)
       
        console.log("hi")
        if(newUser.authenticated){
          const usertype ="customer"
          req.session.user ={username:username,usertype:usertype};
          console.log(req.session.user.username)
          console.log(req.session.user.usertype)
          return res.redirect('/customer_index')
      
        }
        
     
    } catch (error) {
      return res.render('users/author_login',{errors:error,hasErrors:true})
    }
  })  
module.exports = router;