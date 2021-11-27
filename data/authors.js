const mongoCollections = require('./../config/mongoCollections');

const authors = mongoCollections.authors;
let { ObjectId } = require('mongodb');
const bcrypt = require('bcrypt');
const saltRounds = 16;


async function createUser(username, password){
    let trueObj = {userInserted: true}
    username=username.trim()
    password=password.trim()
    console.log(username)
    console.log(password)
    const authorsColl = await authors();
    const authorsList = await authorsColl.find({}).toArray();
    for(let i=0;i<authorsList.length;i++){
        if(authorsList[i].username === username) throw 'Error: Author Already Exists.'
    }
    const hash = await bcrypt.hash(password, saltRounds);
    let newUser = {
        username: username,
        password: hash
    };
    const insertInfo = await usersColl.insertOne(newUser)
    if(insertInfo.insertedCount!== 0){
        const newId= insertInfo.insertedId;
        return trueObj;
    }
    else{
        return false; 
    }
}
module.exports = {
    createUser
}