const mongoCollections = require('./../config/mongoCollections');

const customers = mongoCollections.customers;
const books = mongoCollections.books;
const recents = mongoCollections.recents;
const bcrypt = require('bcrypt');
const saltRounds = 16;

async function createUser(custname, username, password){
    let trueObj = {userInserted: true}
    custname=custname.trim();
    username=username.trim()
    password=password.trim()
    username=username.toLowerCase();
    const customersColl = await customers();
    const customersList = await customersColl.find({}).toArray();
    for(let i=0;i<customersList.length;i++){
        if(customersList[i].username === username) throw 'Error: Customer Already Exists.'
    }
    const hash = await bcrypt.hash(password, saltRounds);
    let booksPurchased = []
    let newUser = {
        name:custname,
        username: username,
        password: hash,
        booksPurchased: booksPurchased
    };
    const insertInfo = await customersColl.insertOne(newUser)
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

         const userCollection = await customers();

         const userInfo = await  userCollection.findOne({username:usernameLower})

         if(userInfo === null) throw 'Either the username or password is invalid'

         const userFind = await userCollection .findOne(
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

async function index_content(){
    //Display all the books with links.
    const booksColl = await books();
    const booksList = await booksColl.find({}).toArray();
    let bookArray = [];
    
    //Have to write error condition when bookslist is empty.
    for(let i=0;i<booksList.length;i++){
        let bookObj = {}
                    bookObj["filename"]=booksList[i].filename
                    bookObj["bookname"]=booksList[i].bookname
                    bookArray.push(bookObj)
       
    }
    return bookArray
}

async function check_bought(username, fname){
    //Display individual books, before that call this function to check whether the user
    //has bought the book or not and display buy button if not bought yet and if bought shw button to read. 
    const usersCollection = await customers();
    const usersList = await usersCollection.find({}).toArray();
    let bought_books; 
    for(let i=0;i<usersList.length;i++){
        if(usersList[i].username===username){
            bought_books = usersList[i].booksPurchased
            break;
        }
    }
    if(bought_books===undefined){
        return false;
    }
    let flag=0;
    for(let j=0;j<bought_books.length;j++){
        if(fname===bought_books[j]){
            flag=1;
            break;
        }        
        else{
            flag=0;
        }
    }
    if(flag===0){
        return false
    }
    else{
        return true;
    }
}
    async function buy_book(username, fname){
        const booksColl = await books();
        const booksList = await booksColl.find({}).toArray();
        let ivaluebooks=0
        let jvaluecust=0;
        for(let i=0;i<booksList.length;i++){
            if(booksList[i].filename===fname){
                ivaluebooks=i;
                break;
            }      
}
let newPur = booksList[ivaluebooks].numberOfPurchase+1;
const updatedbook = {
       numberOfPurchase: newPur
}
const updatedInfo = await booksColl.updateOne(
    { filename: fname },
    { $set: updatedbook }
  );
        const usersCollection = await customers();
    const usersList = await usersCollection.find({}).toArray();
    for(let j=0;j<usersList.length;j++){
        if(usersList[j].username===username){
            jvaluecust=j;
            break;
        }
    }
    usersList[jvaluecust].booksPurchased.push(fname);
    let newArr = usersList[jvaluecust].booksPurchased
const updatedcust = {
       booksPurchased: newArr
}
const updatedInfo1 = await usersCollection.updateOne(
    { username: username },
    { $set: updatedcust }
  );
    return true;
    }

async function recently_added(){
    const recentsColl = await recents();
    const recentsList = await recentsColl.find({}).toArray();
    let recentsArray = [];
    
    //Have to write error condition when recents is empty.
    for(let i=0;i<recentsList.length;i++){
        let recentsObj = {}
                    recentsObj["filename"]=recentsList[i].filename
                    recentsObj["bookname"]=recentsList[i].bookname
                    recentsArray.push(recentsObj)
    }
    return recentsArray
}

async function library(username){
    const usersCollection = await customers();
    const usersList = await usersCollection.find({}).toArray();
    const booksColl = await books();
        const booksList = await booksColl.find({}).toArray();
    let purArray = [] 
    let purBooks = []
    for(let j=0;j<usersList.length;j++){
        if(usersList[j].username===username){
            purBooks = usersList[j].booksPurchased
            break;
        }
    }
    for(let i=0;i<booksList.length;i++){
        for(let k=0;k<purBooks.length;k++){
            if(booksList[i].filename===purBooks[k]){
                let purObj = {}
                    purObj["filename"]=booksList[i].filename
                    purObj["bookname"]=booksList[i].bookname
                    purArray.push(purObj)

            }
        }
        
    }
return purArray

}

async function searchBook(searchedTerm){
        
    const booksColl = await books();
    const booksList = await booksColl.find({ $or :[{bookname:searchedTerm.toLowerCase()} , {authorName:searchedTerm.toLowerCase()}, {bookname:searchedTerm.toUpperCase()} , {authorName:searchedTerm.toUpperCase()}]
    }).toArray();
   
console.log("Inside search functionnnnnnnnnnnnnnnnnnnnnnn")
console.log(booksList)

return booksList; 

}

module.exports = {
    index_content,
    
    createUser,
    checkUser,
    check_bought,
    buy_book,
    recently_added,
    library,
    searchBook
}
