const express = require('express');

const router = express.Router();
const data = require('../data/customers');
const xss = require('xss');
//const usersData = data.users;



function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

router.get('/', async (req, res) => {
    try {
        if(xss(req.session.user) && xss(req.session.user.usertype) == "customer"){
          console.log("Coming inisde index")
          let un = xss(req.session.user.username)
          let utype = xss(req.session.user.usertype)
            let list = await data.index_content()
            console.log(list.length)
            if(list.length===0){
              return res.render('users/customer_index',{nobooks: true,username:un,
                usertype:utype,
                titleName:'Customer Main Page'})
            }
            let recentList = await data.recently_added();
            return res.render('users/customer_index',{books: true, listofrecent: recentList, listofbooks: list ,username:un,
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
        let bookDetails = await data.getBookByFilename(selected_fname)
        // console.log(bookDetails)
        let price = bookDetails.price;
        let reviews1 = [];
        reviews1 = bookDetails.reviews;
        let avgrat = bookDetails.rating;
        avgrat=avgrat.toFixed(2)
        let bookname = bookDetails.bookname;
        let authorname = bookDetails.authorName;
        bookname = capitalizeFirstLetter(bookname)
        authorname = capitalizeFirstLetter(authorname)
        console.log(bookname)
        console.log(authorname)
        //console.log(avgrat)
        //console.log(reviews1)
        if(reviews1.length===0){


          if(bool===false){

            return res.render('users/customer_individual_book', {notbought: true, filename:selected_fname, username:un, price: price, noreviews:true, bookname: bookname, author: authorname})
        }
        else{
            return res.render('users/customer_individual_book', {bought: true, filename:selected_fname, username:un, noreviews:true, bookname: bookname, author: authorname})
        }
          
        }
        if(bool===false){

            return res.render('users/customer_individual_book', {notbought: true, filename:selected_fname, username:un, price: price, reviews:reviews1, avg:avgrat, bookname: bookname, author: authorname})
        }
        else{
            return res.render('users/customer_individual_book', {bought: true, filename:selected_fname, username:un, reviews:reviews1, avg:avgrat, bookname: bookname, author: authorname})
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
        let bookDetails = await data.getBookByFilename(sample_fname);
        let title = bookDetails.bookname;
        let author = bookDetails.authorName;
        title = capitalizeFirstLetter(title)
        author = capitalizeFirstLetter(author)
        return res.render('users/customer_read_sample', {incomingTitle: sample_fname, title: title, author:author})

       
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
        let un = xss(req.session.user.username)
        let bool1 = await data.check_bought(un, full_fname)
        let bookDetails = await data.getBookByFilename(full_fname);
        let title = bookDetails.bookname;
        let author = bookDetails.authorName;
        title = capitalizeFirstLetter(title)
        author = capitalizeFirstLetter(author)
        if(bool1===false){
              return res.redirect('/customer_index/individual_book_page/'+full_fname)
        }
        //console.log(full_fname)
        return res.render('users/customer_read_full', {incomingTitle: full_fname, title:title, author: author})

       
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
        if(bool1.length===0){
          return res.render('users/customer_library', {nobooks: true})
        }
        return res.render('users/customer_library', {purchasedBooks: bool1})
     
    } catch (error) {
        console.log(error)
      res.status(500).json({error:error})
    }
  });




  router.get('/customer_update_personal_details', async (req, res) => {
    
    try {
      console.log(req.session.user)
      console.log(req.session.user.usertype)
      if (req.session.user && req.session.user.usertype === "customer") {
        let toUpdateCustDetails = await data.getCustomerDetails(req.session.user.username)
        console.log(toUpdateCustDetails)
        return res.render('users/customer_update_personal_details',{username:req.session.user.username,
          usertype:req.session.user.usertype,
          customerDetails:toUpdateCustDetails,
          titleName:'Update personal details'})
      }
     
    } catch (error) {
      console.log(error)
      return res.render('users/customer_login')
    }
  });
  router.post('/customer_update_personal_details', async (req, res) => {
    try {
       let requestBody = req.body;
       let error =[]
       console.log(req.session)
       let cn = xss(req.body.customerName);
       let pw = xss(req.body.password);
       cn = cn.trim();
       pw = pw.trim();
       if(typeof(cn)!='string'|| typeof(pw)!='string') throw 'Invalid data has been passed.'
       let toUpdatecustDetails = await data.getCustomerDetails(xss(req.session.user.username))
       console.log(toUpdatecustDetails)
       if(!cn && !pw){
         error.push('Password and name cannot be empty')
         res.status(400).render('users/customer_update_personal_details', {errors:error, titleName:'Update' ,hasErrors: true,  customerDetails:toUpdatecustDetails});
         return;
       }
       function hasWhiteSpace(s) {
         return /\s/g.test(s);
        
       }
       if(hasWhiteSpace(cn)){
        error.push('Name cannot have spaces')
        return res.status(400).res.render('users/customer_update_personal_details', {
          errors: error,
          titleName:'Update',
          hasErrors: true,
          customerDetails:toUpdatecustDetails
          });
      }
      if(hasWhiteSpace(pw)){
        error.push('Password cannot have spaces')
        return res.status(400).res.render('users/customer_update_personal_details', {
          errors: error,
          titleName:'Update',
          hasErrors: true,
          customerDetails:toUpdatecustDetails
          });
      }         
         const {customerName,password} = requestBody;
         
        const newcustomerDetails = await data.updateCustomerDetails(req.session.user.username,customerName,password)
        
         if(newcustomerDetails.authenticated){
          req.session.destroy();
          return res.render('users/logged_out')
         }
     } catch (error) {
       console.log(error)
       return res.status(400).render('users/customer_update_personal_details',{errors:error,hasErrors:true, customerDetails:toUpdatecustDetails})
     }
   })  


   router.get('/review/:id', async (req, res) => {
    let fname = xss(req.params.id);
    //console.log(typeof(bookId))
    const book = await data.getBookByFilename(fname);
    res.render('users/review_form', { book });
    return;
  })

  router.post('/review/:id', async (req, res) => {
    try { 
    let fname = xss(req.params.id);
    let rt = xss(req.body.reviewText);
    let rat = xss(req.body.rating)
    fname = fname.trim();
    rt = rt.trim()
    console.log("Inside review")
    // if(typeof(rat)!='number') throw 'Invalid data has been passed.'
    // if(typeof(fname)!='string' || typeof(rt)!='string') throw 'Invalid data has been passed.'
    const review = await data.registerReview(fname, xss(req.session.user.username), rt, rat);
  
    if (review) {
      res.redirect('/customer_index/customer_library');
      return;
    }
  } catch (e) { 
    console.log(e)
    res.redirect('/review/' + fname)
    return;
  }
  })

module.exports = router;