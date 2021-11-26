const mongoCollections = require('./../config/mongoCollections');

const users = mongoCollections.users;
//const u = mongoCollections.users
let { ObjectId } = require('mongodb');
const bcrypt = require('bcrypt');
const saltRounds = 16;


async function createUser(username, password){
    let trueObj = {userInserted: true}
    username=username.trim()
    password=password.trim()
    console.log(username)
    console.log(password)
    const usersColl = await users();
    const usersList = await usersColl.find({}).toArray();
    for(let i=0;i<usersList.length;i++){
        if(usersList[i].username === username) throw 'Error: Username Already Exists.'
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