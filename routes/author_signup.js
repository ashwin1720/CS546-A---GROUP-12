const express = require('express');

const router = express.Router();
const data = require('../data/authors');
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

  router.get('/', async (req, res) => {
    if (req.session.user) {
        res.redirect('/private');
      } else {
        res.render('users/author_signup',{titleName:'Signup'})
      }
  });

  router.post('/', async (req, res) => {
      try {
        const user_data=req.body;
        //console.log(user_data);
        let un = user_data['email']
        let pw = user_data['password']
  
          if(typeof(un)!='string' || typeof(pw)!='string')
          {
            res.status(400).render('users/author_signup', {notString:true, titleName:'Signup' });
            return;
          }
  
          let bool_un, bool_pw
          bool_un = await check(un, res)
          bool_pw = await check(pw, res)
          if(bool_un===false){
            res.status(400).render('users/author_signup', {isEmptyUn:true, titleName:'Signup'});
            return;
          }
          if(bool_pw===false){
              res.status(400).render('users/author_signup', {isEmptyPw:true, titleName:'Signup'});
              return;
            }
  
          // let un_chk = await validate(un);
          // let pw_chk = await validate_pass(pw);
          // if(un_chk===0){
          //     res.status(400).render('users/signup', {unError:true, titleName:'Signup' });
          //   return;
          // }
          // if(pw_chk===0){
          //     res.status(400).render('users/signup', {pwError:true, titleName:'Signup' });
          //   return;
          // }
          let bool1 = await data.createUser(un, pw)
          //console.log(bool1);
          if(bool1===false){
            res.status(500).render('users/error')
          }
          if(bool1['userInserted']===true){
            console.log('Success !!!')
            res.redirect('/author')
          }
          
      } catch (e) {
        console.log(e)
        res.status(500).render('users/error');
        return;
      
      }
  
    });
  