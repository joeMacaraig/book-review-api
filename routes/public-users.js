import express from "express";
import jwt from "jsonwebtoken";

//Models
import { users } from "../models/users.js";

//Controller
import { publicController } from "../controllers/public.controller.js";

const publicRoutes = express.Router();

const {
  getAllBooks,
  getBookByISBN,
  getBooksByAuthor,
  getBookByTitle,
  getReviewByISBN,
} = publicController;

let usersModel = users;

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
publicRoutes.get("/", async (req, res) => {
  const book = await getAllBooks();
  return book != null
    ? res.status(200).send({ allBooks: book })
    : res.status(404).send({ message: err });
});

// get the book details based on ISBN
publicRoutes.get("/isbn/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  getBookByISBN(isbn)
    .then((book) => {
      if (book != null) {
        res.status(200).send({
          message: `Successfully queried based on ISBN ✅`,
          bookByISBN: book,
        });
      } else {
        res.status(404).send({ message: `ISBN is not found!!!` });
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send({ message: "Internal Server Error" });
    });
});

// get the book details based on author
publicRoutes.get("/author/:author", async (req, res) => {
  const author = req.params.author;
  const book = await getBooksByAuthor(author);
  return book != null
    ? res.status(200).send({
        message: `Successfully queried data based on author ✅`,
        allBooksByAuthor: book,
      })
    : res.status(404).send({ message: `Books by author not found!!!` });
});

// get the books based on title
publicRoutes.get("/title/:title", async (req, res) => {
  const title = req.params.author;
  const book = await getBookByTitle(title);
  return book != null
    ? res.status(200).send({
        message: `Successfully queried data based on title ✅`,
        allBooksByTitle: book,
      })
    : res.status(404).send({ message: `No title found!!!` });
});

// get a review of a isbn
publicRoutes.get("/review/:isbn", async (req, res) => {
  const isbn = req.params.isbn;
  const book = await getReviewByISBN(isbn);
  return book != null
    ? res.status(200).send({
        message: `Successfully queried reviews based on ISBN ✅`,
        bookByISBN: book,
      })
    : res.status(404).send({ message: `ISBN is not found!!!` });
});

export { publicRoutes };
