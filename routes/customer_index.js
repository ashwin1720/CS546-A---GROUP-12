const express = require('express');

const router = express.Router();
const data = require('../data/customers');
//const usersData = data.users;

router.get('/', async (req, res) => {
    try {
        if(req.session.user && req.session.user.usertype == "customer"){
            // console.log("Inside routes")
            // console.log(req.session.user.username)
            // console.log(req.session.user.usertype)
            let list = await data.index_content()
            //console.log(list)
            return res.render('users/customer_index',{listofbooks: list ,username:req.session.user.username,
              usertype:req.session.user.usertype,
              titleName:'Customer Main Page'})
          }
          else{
            return res.redirect('/')
          }
       //return res.render('users/customer_index')
     
    } catch (error) {
      res.status(500).json({error:error})
    }
  });

  router.get('/individual_book_page/:id', async (req, res) => {
    try {
        //console.log("Individual page routes")
        //console.log(req.session.user.username)
        let selected_fname = req.params.id
        //console.log(selected_fname)
        let bool = await data.check_bought(req.session.user.username, selected_fname)
        //console.log(bool)
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
        let sample_fname = req.params.id
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
        let full_fname = req.params.id
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
        let buy_fname = req.params.id
        console.log(buy_fname)
        let bool1 = await data.buy_book(req.session.user.username, buy_fname)
        console.log(bool1)
        //return res.render('users/customer_read_full', {incomingTitle: full_fname})
        res.redirect('/customer_index')

       
       //Should call check_bought and if not bought enable only read samlpe button.
     
    } catch (error) {

        console.log(error)
      res.status(500).json({error:error})
    }
  });
module.exports = router;