const axios = require("axios");

const baseURL = process.env.BOOKS_API_URL || "http://localhost:5000";

// Keep success, missing-book, HTTP error, and network error results explicit.
async function fetchBooks(path, { emptyIsNotFound = false } = {}) {
  try {
    const response = await axios.get(`${baseURL}${path}`, {
      // Inspect non-2xx responses below instead of letting Axios hide their bodies.
      validateStatus: () => true
    });

    if (response.status === 404) {
      return { status: "not_found", statusCode: response.status, data: response.data };
    }
    if (response.status < 200 || response.status >= 300) {
      return {
        status: "error",
        statusCode: response.status,
        data: response.data,
        message: response.data?.message || "The books service returned an error"
      };
    }
    if (emptyIsNotFound && Object.keys(response.data || {}).length === 0) {
      return { status: "not_found", statusCode: 404, data: response.data };
    }
    return { status: "success", statusCode: response.status, data: response.data };
  } catch (error) {
    return {
      status: "error",
      statusCode: error.response?.status || null,
      data: error.response?.data || null,
      message: error.response?.data?.message || error.message
    };
  }
}

function getAllBooks() {
  return fetchBooks("/");
}

function getBookByISBN(isbn) {
  return fetchBooks(`/isbn/${encodeURIComponent(isbn)}`);
}

function getBooksByAuthor(author) {
  return fetchBooks(`/author/${encodeURIComponent(author)}`, { emptyIsNotFound: true });
}

function getBooksByTitle(title) {
  return fetchBooks(`/title/${encodeURIComponent(title)}`, { emptyIsNotFound: true });
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