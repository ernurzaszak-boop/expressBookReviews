const axios = require("axios");

const baseURL = process.env.BOOKS_API_URL || "http://localhost:5000";

async function getAllBooks() {
  const response = await axios.get(`${baseURL}/`);
  return response.data;
}

async function getBookByISBN(isbn) {
  const response = await axios.get(`${baseURL}/isbn/${encodeURIComponent(isbn)}`);
  return response.data;
}

async function getBooksByAuthor(author) {
  const response = await axios.get(`${baseURL}/author/${encodeURIComponent(author)}`);
  return response.data;
}

async function getBooksByTitle(title) {
  const response = await axios.get(`${baseURL}/title/${encodeURIComponent(title)}`);
  return response.data;
}

module.exports = { getAllBooks, getBookByISBN, getBooksByAuthor, getBooksByTitle };

if (require.main === module) {
  (async () => {
    const [allBooks, isbnBook, authorBooks, titleBooks] = await Promise.all([
      getAllBooks(),
      getBookByISBN("1"),
      getBooksByAuthor("Chinua Achebe"),
      getBooksByTitle("Pride and Prejudice")
    ]);
    console.log(JSON.stringify({ allBooks, isbnBook, authorBooks, titleBooks }, null, 2));
  })().catch((error) => {
    console.error(error.response?.data || error.message);
    process.exitCode = 1;
  });
}
