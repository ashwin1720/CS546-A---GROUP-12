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

}

async function check_bought(){

}

module.exports = {
    index_content,
    
    createUser,
    checkUser,
    check_bought
}
