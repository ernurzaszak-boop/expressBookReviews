# Express Book Review API

This project completes the IBM Skills Network Express Book Review starter. It provides public book lookup and registration routes, JWT-protected login and review-management routes, and an Axios client in `general.js` for retrieving books by ISBN, author, and title.

## Run locally

Requires Node.js 18 or newer.

```powershell
pnpm install
node index.js
```

The API listens on `http://localhost:5000`. In another terminal, run `./create-evidence.ps1` to issue the cURL requests and save the command/output pairs in `evidence/`. The script uses a demo-only local account and omits the login token from saved evidence.

## Routes

- `GET /` — all books
- `GET /isbn/:isbn` — a book by ISBN
- `GET /author/:author` — books by author
- `GET /title/:title` — books by title
- `GET /review/:isbn` — reviews for a book
- `POST /register` — register with JSON `{ "username": "...", "password": "..." }`
- `POST /customer/login` — log in and receive a one-hour bearer token
- `PUT /customer/auth/review/:isbn` — add or update the signed-in user's review
- `DELETE /customer/auth/review/:isbn` — delete the signed-in user's review

Set `BOOKS_API_URL` to another server URL to use the Axios functions in `general.js`; running that file directly prints sample results from the local API.
