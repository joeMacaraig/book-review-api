import express from "express";
import { books } from "../models/books.js";
let booksModel = books;

const publicRoutes = express.Router();

// register user
publicRoutes.post("/register", (req, res) => {

});

// get the book list available in the shop
publicRoutes.get("/", (req, res) => {
  const Book = booksModel;
  if (Book) {
    res.status(200).send({ data: books });
  }
});

// get the book details based on ISBN
publicRoutes.get("/isbn/:isbn", (req, res) => {
  try {
    const ISBN = req.params.isbn;
    const Book = booksModel;
    if (Book) {
      Object.keys(books).forEach((key) => {
        if (key == ISBN) {
          res.status(200).send({
            message: `Successfully queried data based on ISBN ✅`,
            data: books[ISBN],
          });
        } else {
          res.status(404).send({ message: `ISBN is not found!!!` });
        }
      });
    }
  } catch (err) {
    console.log(err);
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
      res.status(200).send({
        message: `Successfully queried data based on author ✅`,
        data: allBooksByAuthor,
      });
    }
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
      res.status(200).send({
        message: `Successfully queried data based on title ✅`,
        data: allBooksbyTitle,
      });
    }
  } catch (err) {
    console.log(err);
  }
});

publicRoutes.get("/review/:isbn", (req, res) => {
  try {
    const ISBN = req.params.isbn;
    const Book = booksModel;
    if (Book) {
      Object.keys(books).forEach((key) => {
        if (key == ISBN) {
          res.status(200).send({
            message: `Successfully queried data based on ISBN ✅`,
            data: books[ISBN].reviews
              ? "Book has no reviews"
              : books[ISBN].reviews,
          });
        } else {
          res.status(404).send({ message: `ISBN is not found!!!` });
        }
      });
    }
  } catch (err) {
    console.log(err);
  }
});

export { publicRoutes };
