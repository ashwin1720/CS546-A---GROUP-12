const mongoCollections = require('./../config/mongoCollections');

const authors = mongoCollections.authors;
const books = mongoCollections.books;
let { ObjectId } = require('mongodb');
const bcrypt = require('bcrypt');
const saltRounds = 16;


async function createUser(username, password){
    let trueObj = {userInserted: true}
    username=username.trim()
    password=password.trim()
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
    const insertInfo = await authorsColl.insertOne(newUser)
    if(insertInfo.insertedCount!== 0){
        const newId= insertInfo.insertedId;
        return trueObj;
    }
    else{
        return false; 
    }
}

async function checkUser(username,password){

    if(!username || !password) throw 'username and password must be provided'
    if(username.length  < 4) throw 'username should be atleast 4 characters long'

    if(hasWhiteSpace(username)){
        throw'username cannot have spaces'
        
      } 
      if(hasWhiteSpace(password)){
       throw 'password should not contain spaces'
        
      } 
      function hasWhiteSpace(s) {
        return /\s/g.test(s);
       }

       let usernameLower = username.toLowerCase();

       if (!usernameLower.match(/^[0-9a-z]+$/)){
        throw 'username should be alphanumeric'
         
       } 
       if(password.length<6){
       throw 'password should be atleast 6 characters'
         } 

         const authorCollection = await authors();

         const userInfo = await  authorCollection.findOne({username:username})

         if(userInfo === null) throw 'Either the username or password is invalid'

         const userFind = await authorCollection .findOne(
            { username : usernameLower },
              {projection:{username:1 , password:1}}
        );

        let compareToMatch = false;

        compareToMatch = await bcrypt.compare(password, userFind.password);

        if(!compareToMatch){
            throw 'Either the username or password is invalid'
          }

          let ret ={}
    ret.authenticated = true

    return ret


}

async function getAllBooksByAuthor(username){
    const booksColl = await books();
    const allBookInfo = await booksColl.findOne(
        {authorUserName:{$all:[username]}}
    )
ret ={info:"No book added,please add new book"}
// console.log(allBookInfo)
   if(allBookInfo){
       return allBookInfo
   }
       return ret
   
}

async function createBook(name, authorName, authorUserName, price, description, category, filename){

    revArray = []
    const booksColl = await books();
    let newBook = {
        name: name,
        authorName: authorName,
        authorUserName: authorUserName,
        numberOfPurchase: 0,
        price: price,
        description: description,
        category: category,
        reviews: revArray,
        filename: filename
    };
    const insertInfo = await booksColl.insertOne(newBook)
    if(insertInfo.insertedCount!== 0){
        const newId= insertInfo.insertedId;
        return trueObj;
    }


}



module.exports = {
    createUser,
    checkUser,
    createBook,
    getAllBooksByAuthor
}
