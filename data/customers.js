const mongoCollections = require('./../config/mongoCollections');

const customers = mongoCollections.customers;
//const u = mongoCollections.users
let { ObjectId } = require('mongodb');
const bcrypt = require('bcrypt');
const saltRounds = 16;

async function createUser(){

}
async function checkUser(){

}
async function index_content(){
    //Display all the books with links.

}

async function check_bought(){
    //Display individual books, before that call this function to check whether the user
    //has bought the book or not and display buy button if not bought yet and if bought shw button to read. 

}

module.exports = {
    index_content,
    
    createUser,
    checkUser,
    check_bought
}
