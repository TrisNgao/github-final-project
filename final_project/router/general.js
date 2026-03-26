const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username)=>{
  let userswithsamename = users.filter((user)=>{
    return user.username === username
  });
  if(userswithsamename.length > 0){
    return true;
  } else {
    return false;
  }
}


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    if (!doesExist(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});
    }
  } 
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
//public_users.get('/',function (req, res) {
 // res.send(JSON.stringify(books,null,4));
//});

// Get book details based on ISBN
// public_users.get('/isbn/:isbn',function (req, res) {
  // const ISBN = req.params.isbn;
  // res.send(books[ISBN])
 // });
  
// Get book details based on author
//public_users.get('/author/:author',function (req, res) {
  //let ans = []
    //for(const [key, values] of Object.entries(books)){
      //  const book = Object.entries(values);
        //for(let i = 0; i < book.length ; i++){
          //  if(book[i][0] == 'author' && book[i][1] == req.params.author){
            //    ans.push(books[key]);
            //}
        //}
    //}
    //if(ans.length == 0){
      //  return res.status(300).json({message: "Author not found"});
   // }
   // res.send(ans);
//});

// Get all books based on title
// public_users.get('/title/:title',function (req, res) {
//   let ans = []
//   for(const [key, values] of Object.entries(books)){
//       const book = Object.entries(values);
//       for(let i = 0; i < book.length ; i++){
//           if(book[i][0] == 'title' && book[i][1] == req.params.title){
//               ans.push(books[key]);
//           }
//       }
//   }
//   if(ans.length == 0){
//       return res.status(300).json({message: "No book correspond to this title"});
//   }
//   res.send(ans);
// });

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const ISBN = req.params.isbn;
  res.send(books[ISBN].reviews)
});

// Task 10 : Get the book list available in the shop / Function
function getBookList(){
  return new Promise((resolve,reject)=>{
    resolve(books);
  })
}

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  getBookList().then(
    (book)=>res.send(JSON.stringify(book, null, 4))
  );  
});

// Task 11: Get book details based on ISBN / Function
function getFromISBN(isbn){
  let book = books[isbn];  
  return new Promise((resolve,reject)=>{
    if (book) {
      resolve(book);
    }else{
      reject("There is no book corresponding to isbn: " + isbn);
    }    
  })
}

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  getFromISBN(isbn).then(
    (book)=>res.send(JSON.stringify(book, null, 4)),
    (error) => res.send(error)
  )
 });

// Task 12: Get book details based on author / Function
function getFromAuthor(author) {
    return new Promise((resolve) => {
      let output = [];
      for (var isbn in books) {
        let book = books[isbn];
        if (book.author === author) {
          output.push(book);
        }
      }
      if (output.length > 0) {
        resolve(output);
      } else {
        resolve({ message: "There is no book corresponding to the author: " + author });
      }
    });
  }
  
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  getFromAuthor(author)
  .then(
    result =>res.send(JSON.stringify(result, null, 4))
  );
});

// Task 13: Get all books based on title / Function
function getFromTitle(title) {
    return new Promise((resolve) => {
      let output = [];
      for (var isbn in books) {
        let book = books[isbn];
        if (book.title === title) {
          output.push(book);
        }
      }
      if (output.length > 0) {
        resolve(output);
      } else {
        resolve({ message: "There is no book corresponding to the title: " + title });
      }
    });
  }
  

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  getFromTitle(title)
  .then(
    result =>res.send(JSON.stringify(result, null, 4))
  );
});

module.exports.general = public_users;
