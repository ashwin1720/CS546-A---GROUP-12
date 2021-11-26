const express = require('express');

const router = express.Router();
const data = require('../data/users');
module.exports = router;

async function check(str, res){
    if(str.length==0){
      return false;
      }
    
    let chkEmpty=0
    for(let j=0;j<str.length;j++){
        if(str[j]==' '){
            chkEmpty=0;
        }
        else{
            chkEmpty=1
            break;
        }
    }
    if (chkEmpty==0) {
    return false;
  }
  }
  async function validate(test){
      let reg=/^[a-zA-Z0-9]{4,}$/
      var regex = new RegExp(reg);
      var res = 0;
      if (test.match(regex)) {
          res = 1;
      } else {
          res = 0;
      }
      return res;
  }
  async function validate_pass(test){
      let reg=/^[a-zA-Z0-9.\-_$@*!]{6,}$/
      var regex = new RegExp(reg);
      var res = 0;
      if (test.match(regex)) {
          res = 1;
      } else {
          res = 0;
      }
      return res;
  }
  
  router.get('/', async (req, res) => {
    if (req.session.user) {
        res.redirect('/private');
      } else {
        res.render('users/signup',{titleName:'Signup'})
      }
  });

  router.post('/', async (req, res) => {
      try {
        const user_data=req.body;
        //console.log(user_data);
        let un = user_data['username']
        let pw = user_data['password']
  
          if(typeof(un)!='string' || typeof(pw)!='string')
          {
            res.status(400).render('users/signup', {notString:true, titleName:'Signup' });
            return;
          }
  
          let bool_un, bool_pw
          bool_un = await check(un, res)
          bool_pw = await check(pw, res)
          if(bool_un===false){
            res.status(400).render('users/signup', {isEmptyUn:true, titleName:'Signup'});
            return;
          }
          if(bool_pw===false){
              res.status(400).render('users/signup', {isEmptyPw:true, titleName:'Signup'});
              return;
            }
  
          let un_chk = await validate(un);
          let pw_chk = await validate_pass(pw);
          if(un_chk===0){
              res.status(400).render('users/signup', {unError:true, titleName:'Signup' });
            return;
          }
          if(pw_chk===0){
              res.status(400).render('users/signup', {pwError:true, titleName:'Signup' });
            return;
          }
          let bool1 = await data.createUser(un, pw)
          console.log(bool1);
          if(bool1===false){
            res.status(500).render('users/error')
          }
          if(bool1['userInserted']===true){
            res.redirect('/')
          }
          
      } catch (e) {
        console.log(e)
        res.status(500).render('users/error');
        return;
      
      }
  
    });
  