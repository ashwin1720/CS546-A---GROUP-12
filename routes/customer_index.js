const express = require('express');

const router = express.Router();
const data = require('../data/customers');
const xss = require('xss');
//const usersData = data.users;

router.get('/', async (req, res) => {
    try {
        if(xss(req.session.user) && xss(req.session.user.usertype) == "customer"){
          console.log("Coming inisde index")
          let un = xss(req.session.user.username)
          let utype = xss(req.session.user.usertype)
            let list = await data.index_content()
            let recentList = await data.recently_added();
            return res.render('users/customer_index',{listofrecent: recentList, listofbooks: list ,username:un,
              usertype:utype,
              titleName:'Customer Main Page'})
          }
          else{
            return res.redirect('/')
          }
     
    } catch (error) {
      console.log(error)
      res.status(500).json({error:error})
    }
  });

  router.get('/individual_book_page/:id', async (req, res) => {
    try {
        let selected_fname = xss(req.params.id)
        let un = xss(req.session.user.username)
        //console.log(selected_fname)
        let bool=false;
        
        bool = await data.check_bought(un, selected_fname)
        //console.log("Bool = ", bool)
        //bool=true
        
        if(bool===false){

            return res.render('users/customer_individual_book', {notbought: true, filename:selected_fname})
        }
        else{
            return res.render('users/customer_individual_book', {bought: true, filename:selected_fname})
        }
       
       //Should call check_bought and if not bought enable only read samlpe button.
     
    } catch (error) {
        console.log(error)
      res.status(500).json({error:error})
    }
  });
  router.get('/individual_book_page/read_sample/:id', async (req, res) => {
    try {
        console.log("Sample routes")
        console.log(req.session.user.username)
        let sample_fname = xss(req.params.id)
        console.log(sample_fname)
        return res.render('users/customer_read_sample', {incomingTitle: sample_fname})

       
       //Should call check_bought and if not bought enable only read samlpe button.
     
    } catch (error) {

        console.log(error)
      res.status(500).json({error:error})
    }
  });


  router.get('/individual_book_page/read_full/:id', async (req, res) => {
    try {
        console.log("Full routes")
        console.log(req.session.user.username)
        let full_fname = xss(req.params.id)
        console.log(full_fname)
        return res.render('users/customer_read_full', {incomingTitle: full_fname})

       
       //Should call check_bought and if not bought enable only read samlpe button.
     
    } catch (error) {

        console.log(error)
      res.status(500).json({error:error})
    }
  });
  router.get('/individual_book_page/buy/:id', async (req, res) => {
    try {
        //Update user's array
        //Update number of books purchased inside boosk colection
        //
        console.log("Buy routes")
        console.log(req.session.user.username)
        let buy_fname = xss(req.params.id)
        console.log(buy_fname)
        let un = xss(req.session.user.username)
        let bool1 = await data.buy_book(un, buy_fname)
        console.log(bool1)
        //return res.render('users/customer_read_full', {incomingTitle: full_fname})
        res.redirect('/customer_index');
       //Should call check_bought and if not bought enable only read samlpe button.
     
    } catch (error) {

        console.log(error)
      res.status(500).json({error:error})
    }
  });
  router.get('/customer_library', async (req, res) => {
    try {
      let un = xss(req.session.user.username)
        let bool1 = await data.library(un)
        return res.render('users/customer_library', {purchasedBooks: bool1})
     
    } catch (error) {
        console.log(error)
      res.status(500).json({error:error})
    }
  });
module.exports = router;