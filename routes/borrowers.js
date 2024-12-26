const express = require('express');
const router = express.Router();
const Book = require('../models/Book');
const Borrower = require('../models/Borrower');

// Add a new borrower
router.post('/', async (req, res) => {
  try {
    const borrower = new Borrower(req.body);
    await borrower.save();
    res.status(201).json(borrower);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET route to get all borrowers
router.get('/', async (req, res) => {
  try {
    const borrowers = await Borrower.find();
    res.json(borrowers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update a borrower
router.put('/:id', async (req, res) => {
  try {
    const borrower = await Borrower.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!borrower) return res.status(404).json({ error: 'Borrower not found' });
    res.json(borrower);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE route to delete a borrower by ID
router.delete('/:id', async (req, res) => {
  try {
    const borrower = await Borrower.findById(req.params.id);
    if (!borrower) {
      return res.status(404).json({ message: 'Borrower not found' });
    }

    if (borrower.borrowedBooks.length > 0) {
      return res.status(400).json({ message: 'Cannot delete borrower, they have borrowed books' });
    }

    await borrower.remove();
    res.json({ message: 'Borrower deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST route to borrow a book
router.post('/borrow', async (req, res) => {
  try {
    const { borrowerId, bookId } = req.body;

    // Find the borrower
    const borrower = await Borrower.findById(borrowerId);
    if (!borrower) {
      return res.status(404).json({ message: 'Borrower not found' });
    }

    // Check if the borrower has overdue books
    const overdueBooks = borrower.borrowedBooks.filter(book => {
      return new Date(book.dueDate) < new Date(); // Assuming borrowedBooks contains dueDate
    });

    if (overdueBooks.length > 0) {
      return res.status(400).json({ message: 'Cannot borrow book. Borrower has overdue books.' });
    }

    // Check the borrowing limit based on membership type
    const borrowingLimit = borrower.membershipType === 'premium' ? 10 : 5;
    if (borrower.borrowedBooks.length >= borrowingLimit) {
      return res.status(400).json({ message: `Cannot borrow more than ${borrowingLimit} books.` });
    }

    // Find the book
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Check if there are available copies
    if (book.availableCopies <= 0) {
      return res.status(400).json({ message: 'No available copies for this book' });
    }

    // Decrease available copies of the book
    book.availableCopies -= 1;
    await book.save();

    // Add the book to the borrower's borrowedBooks array
    borrower.borrowedBooks.push({
      book: bookId,
      borrowDate: new Date(),
      dueDate: new Date(new Date().setDate(new Date().getDate() + 14)) // 2 weeks due date
    });
    await borrower.save();

    res.status(200).json({ message: 'Book borrowed successfully', borrower });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST route to return a book
router.post('/return', async (req, res) => {
  try {
    const { borrowerId, bookId } = req.body;

    // Find the borrower
    const borrower = await Borrower.findById(borrowerId);
    if (!borrower) {
      return res.status(404).json({ message: 'Borrower not found' });
    }

    // Find the book in the borrower's borrowedBooks array
    const bookIndex = borrower.borrowedBooks.findIndex(b => b.book.toString() === bookId);
    if (bookIndex === -1) {
      return res.status(404).json({ message: 'Book not borrowed by this borrower' });
    }

    // Find the book and increase the available copies
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    book.availableCopies += 1;  // Increase the availableCopies by 1
    await book.save();

    borrower.borrowedBooks.splice(bookIndex, 1);  // Remove the book from the array
    await borrower.save();

    res.status(200).json({ message: 'Book returned successfully', borrower });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
