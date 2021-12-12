const express = require('express');

const router = express.Router();
const data = require('../data/customers');
const xss = require('xss');
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

  try {
    if(!xss(req.session.user)){
      return res.render('users/customer_signup',{titleName:'Customer Signup'})
    }if(xss(req.session.user) && xss(req.session.user.usertype) ==="customer"){
      return res.render('users/customer_index',{titleName:'Customer Main Page'})
    }
   } catch (error) {
    res.status(500).json({error:error})
  }
});

router.post('/', async (req, res) => {
    try {
      const user_data=req.body;
      //console.log(user_data);
      let custname = xss(req.body.custname)
      let un = xss(req.body.username)
      let pw = xss(req.body.password)

        if(typeof(un)!='string' || typeof(pw)!='string' || typeof(custname)!='string')
        {
          res.status(400).render('users/customer_signup', {notString:true, titleName:'Signup' });
          return;
        }

        let bool_cust, bool_un, bool_pw
        bool_cust = await check(custname, res);
        bool_un = await check(un, res)
        bool_pw = await check(pw, res)
        if(bool_cust===false){
          res.status(400).render('users/customer_signup', {isEmptyUn:true, titleName:'Signup'});
          return;
        }
        if(bool_un===false){
          res.status(400).render('users/customer_signup', {isEmptyUn:true, titleName:'Signup'});
          return;
        }
        if(bool_pw===false){
            res.status(400).render('users/customer_signup', {isEmptyPw:true, titleName:'Signup'});
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
        let bool1 = await data.createUser(custname, un, pw)
        if(bool1===false){
          res.status(500).render('users/error')
        }
        if(bool1['userInserted']===true){
          res.redirect('/customer_login')
        }
        
    } catch (e) {
      console.log(e)
      res.status(500).render('users/error');
      return;
    
    }

  });

module.exports = router;