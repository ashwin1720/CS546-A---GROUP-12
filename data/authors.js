const mongoCollections = require('./../config/mongoCollections');

const authors = mongoCollections.authors;
const books = mongoCollections.books;
const recents = mongoCollections.recents;
let { ObjectId } = require('mongodb');
const bcrypt = require('bcrypt');
const { Console } = require('console');
const saltRounds = 16;

async function createUser(username,authorName, password){
    let trueObj = {userInserted: true}
    username=username.trim()
    password=password.trim()
    authorName = authorName.trim()
    username =username.toLowerCase()

    const authorsColl = await authors();
    const authorsList = await authorsColl.find({}).toArray();
    for(let i=0;i<authorsList.length;i++){
        if(authorsList[i].username === username) 
        return false;
    }
    const hash = await bcrypt.hash(password, saltRounds);
    let newUser = {
        username: username,
        authorName:authorName,
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

         const userCollection = await authors();

         const userInfo = await  userCollection.findOne({username:usernameLower})

         if(userInfo === null) throw 'Either the username or password is invalid'

         const userFind = await userCollection .findOne(
            { username : usernameLower },
              {projection:{username:1 , password:1,authorName:1}}
        );


        console.log(userFind)

        let compareToMatch = false;

        compareToMatch = await bcrypt.compare(password, userFind.password);

        if(!compareToMatch){
            throw 'Either the username or password is invalid'
          }

          let ret ={}
    ret.authenticated = true
    ret.authorName = userFind.authorName

    return ret


}

async function createBook(bookname, authorName, authorUserName, price, description, category, filename){

    revArray = []

    const booksColl = await books();
    const recentsColl = await recents();
    const recentsList = await recentsColl.find({}).toArray();
    if(recentsList.length===5){
        let del_name_book = recentsList[0].filename;
        recentsColl.deleteOne({"filename": del_name_book})
        let newrecentBook = {
            bookname: bookname,
            filename: filename
        }
        const insertrecentsInfo = await recentsColl.insertOne(newrecentBook) 
    }
    else{
        let newrecentBook = {
            bookname: bookname,
            filename: filename
        }
        const insertrecentsInfo = await recentsColl.insertOne(newrecentBook) 
    }
    let newBook = {
        bookname: bookname,
        authorName: authorName,
        authorUserName: authorUserName,
        numberOfPurchase: 0,
        price: price,
        description: description,
        category: category,
        rating: 0,
        reviews: revArray,
        filename: filename
    };
    const insertInfo = await booksColl.insertOne(newBook)
    if(insertInfo.insertedCount!== 0){
        const newId= insertInfo.insertedId;
        return true;
    }
}
async function displayBooks(authorusername){
    const booksColl = await books();
    const booksList = await booksColl.find({}).toArray();
    const recentsColl = await recents();
    const recentsList = await recentsColl.find({}).toArray();
    let noBooks = "error"
    let bookArray = [];
    
    for(let i=0;i<booksList.length;i++){
        if(booksList[i].authorUserName===authorusername){
            let bookObj = {}
                    bookObj["filename"]=booksList[i].filename
                    bookObj["bookname"]=booksList[i].bookname
                    bookArray.push(bookObj)
        }
       
    }
    
    if(bookArray.length === 0){
        bookArray.push(noBooks)
        return bookArray
    }
    return bookArray
}
async function search_book(fname){
    const booksColl = await books();

    const booksList = await booksColl.find({}).toArray();
    let revObj = {}
    for(let i=0;i<booksList.length;i++){
        if(booksList[i].filename===fname){
                    revObj["rating"] = booksList[i].rating; 
                    revObj["review"] = booksList[i].reviews;
                    revObj["bname"] =  booksList[i].bookname;
                    revObj['price'] = booksList[i].price;
                    revObj['description'] = booksList[i].description;
                    revObj['numberOfPurchase'] =booksList[i].numberOfPurchase;
                    
        }

}
return revObj; 
}

async function getAuthorDetails(username){
    console.log(username)
    username=username.toLowerCase()
    const userCollection = await authors();
   
    console.log("inside getAuthorDetail")
    const userFind = await userCollection .findOne(
        { username : username },
          {projection:{username:1 , password:1,authorName:1}}
    );
    console.log(userFind)
    return userFind
}

async function updateAuthorDetails(oldusername,authorName,password){
    const userCollection = await authors()


    function hasWhiteSpace(s) {
        return /\s/g.test(s);
       }

    if(authorName){
        if(hasWhiteSpace(authorName)){
            throw 'name should not contain spaces'
           } 
           let oldusernameLower = oldusername.toLowerCase();
    
    let newAuthorDetails = {
       authorName:authorName,
}
    const updatedAuthorInfo = await userCollection.updateOne(
        { username: oldusernameLower },
        { $set: newAuthorDetails}
      );
      if (updatedAuthorInfo.modifiedCount === 0) {
        throw 'could not update author details successfully';
      }

    }
    if(password){
        if(hasWhiteSpace(password)){
            throw 'password should not contain spaces'
           } 
           if(password.length<6){
            throw 'password should be atleast 6 characters'
              }
              const hashpassword = await bcrypt.hash(password, saltRounds);
              let oldusernameLower = oldusername.toLowerCase();
    
    let newAuthorDetails = {
       password:hashpassword
}
    const updatedAuthorInfo = await userCollection.updateOne(
        { username: oldusernameLower },
        { $set: newAuthorDetails}
      );
      if (updatedAuthorInfo.modifiedCount === 0) {
        throw 'could not update author details successfully';
      }

    }
    
      
      
      let ret ={}
      ret.authenticated = true
      return ret
 }
module.exports = {
    createUser,
    checkUser,
    createBook,
    displayBooks,
    search_book,
    getAuthorDetails,
    updateAuthorDetails
}
