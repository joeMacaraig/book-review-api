import { books } from "../models/books.js";

let bookModel = books;

export const publicController = {
  getAllBooks: async () => {
    try {
      const book = bookModel;
      return book != null ? book : {};
    } catch (err) {
      console.log(err);
    }
  },
  getBookByISBN: async (isbn) => {
    try {
      const Book = bookModel;
      const book = Object.keys(bookModel).find((item) => item === isbn);
      return Book[book] != null ? Book[book] : {};
    } catch (err) {
      console.log(err);
    }
  },
  getBooksByAuthor: async (author) => {
    try {
      const book = bookModel;
      const allBooksByAuthor = {};
      if (book) {
        for (let key in book) {
          if (book[key].author === author) {
            allBooksByAuthor[key] = book[key];
          }
        }
      }
      return allBooksByAuthor != null ? allBooksByAuthor : {};
    } catch (err) {
      console.log(err);
    }
  },
  getBookByTitle: async (title) => {
    try {
      const book = bookModel;
      const allBooksByTitle = {};
      if (book) {
        for (let key in book) {
          if (book[key].title === title) {
            allBooksByTitle[key] = book[key];
          }
        }
      }
      return allBooksByTitle != null ? allBooksByTitle : {};
    } catch (err) {
      console.log(err);
    }
  },
  getReviewByISBN: async (isbn) => {
    try {
      const Book = bookModel;
      const book = Object.keys(books).find((item) => item === isbn);
      return Book[book].reviews;
    } catch (err) {
      console.log(err);
    }
  },
};