const express = require('express');
const router = express.Router();
const Author = require('../models/Author');
const Book = require('../models/Book');

// Add a new author
router.post('/', async (req, res) => {
  try {
    const author = new Author(req.body);
    await author.save();
    res.status(201).json(author);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET route to get all authors
router.get('/', async (req, res) => {
    try {
        const authors = await Author.find();
        res.json(authors);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update an author
router.put('/:id', async (req, res) => {
  try {
    const author = await Author.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!author) return res.status(404).json({ error: 'Author not found' });
    res.json(author);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete an author
router.delete('/:id', async (req, res) => {
  try {
    const author = await Author.findByIdAndDelete(req.params.id);
    if (!author) return res.status(404).json({ error: 'Author not found' });
    res.json({ message: 'Author deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET route to find authors linked to more than 5 books
router.get('/over-limit', async (req, res) => {
    try {
        const authors = await Author.find();
        const overLimitAuthors = [];

        for (let author of authors) {
            const bookCount = await Book.countDocuments({ author: author._id });
            if (bookCount > 5) {
                overLimitAuthors.push({ author, bookCount });
            }
        }

        res.status(200).json(overLimitAuthors);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
