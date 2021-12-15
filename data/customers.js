const mongoCollections = require('./../config/mongoCollections');

const customers = mongoCollections.customers;
const books = mongoCollections.books;
const recents = mongoCollections.recents;
const bcrypt = require('bcrypt');
const saltRounds = 16;
let { ObjectId } = require('mongodb');
async function createUser(custname, username, password){
    let trueObj = {userInserted: true}
    custname=custname.trim();
    username=username.trim()
    password=password.trim()
    
    if(!custname || !username || !password) throw 'Fields cannot be empty.'
    if(typeof(custname)!='string' || typeof(username)!='string'|| typeof(password)!='string') throw 'Error: Data should be string'
    username=username.toLowerCase();
    if(username.length<4) throw 'Error: Username should be atleast of 4 characters.'
    if(password.length<6) throw 'Error: Passsword should be atleast of 6 characters.'
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
        throw 'Error: Unable to create account.'
    }
}

async function checkUser(username,password){
    
    password=password.trim();
    if(!username || !password) throw 'Fields cannot be empty.'
    if(typeof(username)!='string'|| typeof(password)!='string') throw 'Error: Data should be string'
    username=username.trim().toLowerCase();
    if(username.length<4) throw 'Error: Username should be atleast of 4 characters.'
    if(password.length<6) throw 'Error: Passsword should be atleast of 6 characters.'

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


    username=username.trim().toLowerCase();
    fname=fname.trim()
    if(!username || !fname){
        throw 'Error: Something went wrong'
    }
    if(typeof(username)!='string'|| typeof(fname)!='string') throw 'Error: Data should be string'
    if(username.length<4) throw 'Error: Username should be atleast of 4 characters.'
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
        username=username.trim().toLowerCase();
        fname=fname.trim();

    if(!username || !fname){
        throw 'Error: Something went wrong'
    }
    if(typeof(username)!='string'|| typeof(fname)!='string') throw 'Error: Data should be string'
    if(username.length<4) throw 'Error: Username should be atleast of 4 characters.'
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
  if(updatedInfo.modifiedCount<1) throw 'Error: Unable to purchase.'
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
  if(updatedInfo1.modifiedCount<1) throw 'Error: Unable to purchase.'
    return true;
    }

async function recently_added(){
    const recentsColl = await recents();
    const recentsList = await recentsColl.find({}).toArray();
    let recentsArray = [];
    for(let i=0;i<recentsList.length;i++){
        let recentsObj = {}
                    recentsObj["filename"]=recentsList[i].filename
                    recentsObj["bookname"]=recentsList[i].bookname
                    recentsArray.push(recentsObj)
    }
    //if(recentsArray.length===0) throw 'No recently added'
    return recentsArray
}

async function library(username){
    username=username.trim();
    
    if(!username){
        throw 'Error: Cannot find user.'
    }
    if(typeof(username)!='string') throw 'Invalid data has been passed.'
    username=username.toLowerCase();
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
                    purObj['bookId'] = booksList[i]._id.toString()
                    purArray.push(purObj)

            }
        }
        
    }
return purArray

}

async function searchBook(searchedTerm){
    searchedTerm=searchedTerm.trim();
    if(!searchedTerm) throw 'Error: Search Term Is Empty.'
    if(typeof(searchedTerm)!='string') throw 'Invalid data has been passed'
    const booksColl = await books();
    const booksList = await booksColl.find({ $or :[{bookname:searchedTerm.toLowerCase()} , {authorName:searchedTerm.toLowerCase()}, {bookname:searchedTerm.toUpperCase()} , {authorName:searchedTerm.toUpperCase()}]
    }).toArray();
    
    if(booksList.length===0) throw 'Error: Not Found'
    return booksList; 

}
async function searchCategory(searchedTerm){
    
    let searchedTermTrim = searchedTerm.trim();
    if(!searchedTermTrim) throw 'Error: Search Term Is Empty.'
    if(typeof(searchedTerm)!='string') throw 'Invalid data has been passed.'
    let searchedTermlower = searchedTermTrim.toLowerCase();
    const booksColl = await books();
    const booksList = await booksColl.find({ $or :[{category:searchedTermlower} ]
    }).toArray();
    if(booksList.length===0) throw 'Error: Not Found'
    return booksList; 

}


async function getCustomerDetails(username){
    username=username.trim()
    if(!username) throw 'Username not valid'
    if(typeof(username)!='string') throw 'Invalid data has been passed.'
    username=username.toLowerCase()
    const userCollection = await customers();
    const userFind = await userCollection .findOne(
        { username : username },
          {projection:{username:1 , password:1, name:1}}
    );
    return userFind
}

async function updateCustomerDetails(oldusername,custName,password){
    oldusername=oldusername.trim();
    custName=custName.trim()
    password=password.trim();
    if(typeof(oldusername)!='string'||typeof(custName)!='string'||typeof(password)!='string') throw 'Invalid data has been passed.'
    const userCollection = await customers()


    function hasWhiteSpace(s) {
        return /\s/g.test(s);
       }

    if(custName){
        if(hasWhiteSpace(custName)){
            throw 'name should not contain spaces'
           } 
           let oldusernameLower = oldusername.toLowerCase();
    
    let newCustDetails = {
       name:custName,
}
    const updatedCustInfo = await userCollection.updateOne(
        { username: oldusernameLower },
        { $set: newCustDetails}
      );
      if (updatedCustInfo.modifiedCount === 0) {
        throw 'could not update customer details successfully';
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
    
    let newCustDetails = {
       password:hashpassword
}
    const updatedCustInfo = await userCollection.updateOne(
        { username: oldusernameLower },
        { $set: newCustDetails}
      );
      if (updatedCustInfo.modifiedCount === 0) {
        throw 'could not update customer details successfully';
      }

    }

      let ret ={}
      ret.authenticated = true
        return ret;
}

async function getBookByFilename(fname)
 {
     fname=fname.trim()
     if(!fname){
         throw 'Filname not found.'
     }
    const bookColl = await books();
    const book = await bookColl.findOne({ filename: fname });
    
    //book._id = book._id.toString();
    return book;
 }

const registerReview = async (fname, reviewName, reviewText, rating) => {
    fname=fname.trim();
    reviewName=reviewName.trim();
    reviewText=reviewText.trim();

    // if(!fname || !reviewName || !reviewText) throw 'Error: Invalid data has been sent.'
    // if(typeof(fname)!='string'||typeof(reviewName)!='string'||typeof(reviewText)!='string') throw 'Error: Invalid data has been sent.'
    // if(typeof(rating)!='number') 'Error: Invalid data has been sent.'
    
    const bookColl = await books();
    const registerReview = await bookColl.updateOne({ filename: fname }, {
        $addToSet: {
            reviews: {
                _id: new ObjectId(),
                reviewerName: reviewName,
                reviewText,
                rating
            }
        }
    });
    // calculate average
    const allReviews = await bookColl.findOne({ filename: fname });
    let sum = 0;
    let average = 0;
    if (allReviews.reviews) {
    for (const review of allReviews.reviews) {
        sum = sum + parseInt(review.rating);
    }
    average = sum/allReviews.reviews.length;
    }
    const addRating = await bookColl.updateOne({ filename: fname}, { $set: { rating: average }})
    return true;
}

module.exports = {
    index_content,
    createUser,
    checkUser,
    check_bought,
    buy_book,
    recently_added,
    library,
    searchBook,
    searchCategory,
    getCustomerDetails,
    updateCustomerDetails,
    getBookByFilename,
    registerReview,

}
