import express from "express";

// models
import { books } from "../models/books.js";

let bookModel = books;

const authRouter = express.Router();

// add / modify a review to the book collection
authRouter.put("/auth/review/:isbn/:review", (req, res) => {
  const { isbn, review } = req.params;
  const book = Object.keys(books).find((item) => item === isbn);
  if (book) {
    bookModel[book].reviews = { review };
    return res.status(200).send({
      message: `Added new review to ${bookModel[book].title}. ✅'`,
      updatedReview: bookModel[book],
    });
  } else {
    return res.status(404).send({ message: `review required!` });
  }
});

// deletes a book by isbn
authRouter.delete("/auth/delete/:isbn", (req, res) => {
  const { isbn } = req.params;
  const book = Object.keys(books).find((item) => item === isbn);
  if (book) {
    bookModel[book].reviews = {};
    return res.status(200).send({
      message: `Deleted review from ${bookModel[book].title}. ✅'`,
      deletedReview: bookModel[book],
    });
  } else {
    return res.status(404).send({ message: `review required!` });
  }
});

export { authRouter };
