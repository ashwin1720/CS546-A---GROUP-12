const express = require('express');

const router = express.Router();
const data = require('../data/users');
//const usersData = data.users;

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

router.post('/', async (req, res) => {
    try {
      const user_data=req.body;
      //console.log(user_data);
      let un = user_data['username']
      let pw = user_data['password']

        if(typeof(un)!='string' || typeof(pw)!='string')
        {
          res.status(400).render('users/login', {notString:true, titleName:'Login' });
          return;
        }

        let bool_un, bool_pw
        bool_un = await check(un, res)
        bool_pw = await check(pw, res)
        if(bool_un===false){
          res.status(400).render('users/login', {isEmptyUn:true, titleName:'Login'});
          return;
        }
        if(bool_pw===false){
            res.status(400).render('users/login', {isEmptyPw:true, titleName:'Login'});
            return;
          }

        let un_chk = await validate(un);
        let pw_chk = await validate_pass(pw);
        if(un_chk===0){
            res.status(400).render('users/login', {unError:true, titleName:'Login' });
          return;
        }
        if(pw_chk===0){
            res.status(400).render('users/login', {pwError:true, titleName:'Login' });
          return;
        }
        let bool1 = await data.checkUser(un, pw)
        req.session.user = { username: un };
        res.redirect('/private');
        
    } catch (e) {
      console.log(e)
      res.status(400).render('users/login', {hasErrors:true});
      return;
    
    }

  });

  module.exports = router;