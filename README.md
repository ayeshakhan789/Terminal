# Terminal
Library Management API
Description
This project implements a Library Management System API to manage books, authors, and borrowers. The system supports CRUD operations for books and borrowers, as well as book borrowing and returning functionality.

Features
Books Management:

Add, view, update, and delete books.
Tracks available copies and total copies.
Borrowers Management:

Add, view, update, and delete borrowers.
Handles borrowing and returning of books.
Supports membership types (Standard and Premium) with borrowing limits.
Authors Management:

Manage author records with a relationship to their books.
File Structure
routes/

books.js - Handles routes for managing books.
borrowers.js - Handles routes for borrowers, including borrowing and returning books.
authors.js - Handles routes for author management.
models/

Book.js - Defines the Book schema.
Borrower.js - Defines the Borrower schema, including custom validations.
Author.js - Defines the Author schema.
server.js

Entry point for the API, initializes Express, connects to MongoDB, and sets up routes.
Endpoints
Books:

POST /books - Add a new book.
GET /books - Retrieve all books.
PUT /books/:id - Update a book by ID.
DELETE /books/:id - Delete a book by ID.
Borrowers:

POST /borrowers - Add a new borrower.
GET /borrowers - Retrieve all borrowers.
PUT /borrowers/:id - Update a borrower by ID.
DELETE /borrowers/:id - Delete a borrower by ID.
POST /borrowers/borrow - Borrow a book.
POST /borrowers/return - Return a book.
Authors:

POST /authors - Add a new author.
GET /authors - Retrieve all authors.
PUT /authors/:id - Update an author by ID.
DELETE /authors/:id - Delete an author by ID.
Setup Instructions
Clone the repository.
Run npm install to install dependencies.
Start the server with node server.js.
Use tools like Postman to interact with the API.