import express from "express";
import jwt from "jsonwebtoken";

//Models
import { users } from "../models/users.js";
import { books } from "../models/books.js";

let booksModel = books;
let usersModel = users;

const publicRoutes = express.Router();

//checks for users
const existing = (username) => {
  let checkUser = Object.keys(usersModel).filter((user) => {
    return user.username === username;
  });
};

//check for authenticated user
const authenticatedUser = (username, password) => {
  let valid = Object.keys(usersModel).filter((user) => {
    return (
      usersModel[user].username === username &&
      usersModel[user].password === password
    );
  });
  if (valid.length > 0) {
    return true;
  } else {
    return false;
  }
};

// get users
publicRoutes.get("/users", (req, res) => {
  return res.status(200).send({ data: usersModel });
});

// register user
publicRoutes.post("/register", (req, res) => {
  const { username, password } = req.body;
  if (username && password) {
    if (!existing(username)) {
      usersModel[Object.keys(usersModel).length + 1] = {
        username: username,
        password: password,
      };
      return res
        .status(200)
        .send({ message: `${username} was successfully created!` });
    } else {
      return res.status(404).send({ message: `${username} already exists!` });
    }
  }
});

// login user
publicRoutes.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(404).json({ message: "Error logging in" });
  }
  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign(
      {
        data: password,
      },
      "access",
      { expiresIn: 60 * 60 }
    );
    req.session.authorization = {
      accessToken,
      username,
    };
    return res.status(200).send("Customer successfully logged in");
  } else {
    return res
      .status(208)
      .send({ message: "Invalid Login. Check username and password" });
  }
});

// get the book list available in the shop
publicRoutes.get("/", (req, res) => {
  try {
    const Book = booksModel;
    if (Book) {
      return res.status(200).send({ allBooks: Book });
    }
  } catch (err) {
    return res.status(404).send({ message: err });
  }
});

// get the book details based on ISBN
publicRoutes.get("/isbn/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const book = Object.keys(books).find((item) => item === isbn);
  if (book) {
    res.status(200).send({
      message: `Successfully queried based on ISBN ✅`,
      bookByISBN: books[book],
    });
  } else {
    return res.status(404).send({ message: `ISBN is not found!!!` });
  }
});

// get the book details based on author
publicRoutes.get("/author/:author", (req, res) => {
  try {
    const author = req.params.author;
    const Book = booksModel;
    const allBooksByAuthor = {};
    if (Book) {
      for (let key in books) {
        if (books[key].author === author) {
          allBooksByAuthor[key] = books[key];
        }
      }
    }
    return res.status(200).send({
      message: `Successfully queried data based on author ✅`,
      allBooksByAuthor: allBooksByAuthor,
    });
  } catch (err) {
    console.log(err);
  }
});

// get the books based on title
publicRoutes.get("/title/:title", (req, res) => {
  try {
    const title = req.params.title;
    const Book = booksModel;
    const allBooksbyTitle = {};
    if (Book) {
      for (let key in books) {
        if (books[key].title === title) {
          allBooksbyTitle[key] = books[key];
        }
      }
      return res.status(200).send({
        message: `Successfully queried data based on title ✅`,
        allBooksByTitle: allBooksbyTitle,
      });
    }
  } catch (err) {
    console.log(err);
  }
});

// get a review of a isbn
publicRoutes.get("/review/:isbn", async (req, res) => {
  try {
    const isbn = req.params.isbn;
    const book = Object.keys(books).find((item) => item === isbn);
    if (book) {
      res.status(200).send({
        message: `Successfully queried based on ISBN ✅`,
        reviews: books[book].reviews,
      });
    } else {
      return res.status(404).send({ message: `ISBN is not found!!!` });
    }
  } catch (err) {
    console.log(err);
  }
});

export { publicRoutes };
