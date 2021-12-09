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
    username=username.toLowerCase();
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
    console.log("Hello")
    console.log(password)
    
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
         console.log("After")

         const userCollection = await authors();

         const userInfo = await  userCollection.findOne({username:usernameLower})

         if(userInfo === null) throw 'Either the username or password is invalid'

         const userFind = await userCollection .findOne(
            { username : usernameLower },
              {projection:{username:1 , password:1}}
        );
        console.log(userFind)

        let compareToMatch = false;

        compareToMatch = await bcrypt.compare(password, userFind.password);

        if(!compareToMatch){
            throw 'Either the username or password is invalid'
          }

          let ret ={}
    ret.authenticated = true

    return ret


}

async function createBook(bookname, authorName, authorUserName, price, description, category, filename){

    revArray = []
    const booksColl = await books();
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
    console.log("ronaldo")
    if(insertInfo.insertedCount!== 0){
        const newId= insertInfo.insertedId;
        // return trueObj;
        return true;
    }
}
async function displayBooks(authorusername){
    const booksColl = await books();
    const booksList = await booksColl.find({}).toArray();
    let bookArray = [];
    let bookObj = {}
    for(let i=0;i<booksList.length;i++){
        if(booksList[i].authorUserName===authorusername){
                    bookObj["filename"]=booksList[i].filename
                    bookObj["bookname"]=booksList[i].bookname
                    bookArray.push(bookObj)
        }
       
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

module.exports = {
    createUser,
    checkUser,
    createBook,
    displayBooks,
    search_book
}
