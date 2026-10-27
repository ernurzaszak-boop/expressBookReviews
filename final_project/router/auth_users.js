const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
  return users.some((user) => user.username === username);
}

const authenticatedUser = (username,password)=>{ //returns boolean
  return users.some((user) => user.username === username && user.password === password);
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const { username, password } = req.body || {};
  if (!authenticatedUser(username, password)) {
    return res.status(401).json({ message: "Invalid username or password" });
  }
  const token = jwt.sign({ username }, "fingerprint_customer", { expiresIn: "1h" });
  return res.status(200).json({ message: "Login successful", token });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const book = books[req.params.isbn];
  if (!book) return res.status(404).json({ message: "Book not found" });
  const { review } = req.body || {};
  if (typeof review !== "string" || !review.trim()) {
    return res.status(400).json({ message: "A non-empty review is required" });
  }
  book.reviews[req.user.username] = review.trim();
  return res.status(200).json({
    message: "Review added successfully",
    reviews: book.reviews
  });
});

// Delete the authenticated user's review for a book.
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const book = books[req.params.isbn];
  if (!book) return res.status(404).json({ message: "Book not found" });
  if (!Object.prototype.hasOwnProperty.call(book.reviews, req.user.username)) {
    return res.status(404).json({ message: "Review not found" });
  }
  delete book.reviews[req.user.username];
  return res.status(200).json({
    message: "Review deleted successfully",
    reviews: book.reviews
  });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
