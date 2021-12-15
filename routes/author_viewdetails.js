const express = require('express');

const router = express.Router();
const data = require('../data/authors');
const xss = require('xss');
module.exports = router;

router.get('/:id', async (req, res) => {
    try {
        const revObj = await data.search_book(xss(req.params.id));
        let rating = revObj.rating;
        let reviews = revObj.review;
        let bname = revObj.bname;
            res.render('users/book_details', {bname:bname, ratings: rating, reviews: reviews, titleName:"Book"});
            return;
    } catch (e) {
        
        res.status(404).render('users/book_details',{hasErrors:true, errors:e});
    }
  });