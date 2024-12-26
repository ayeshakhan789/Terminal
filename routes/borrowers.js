const express = require('express');
const router = express.Router();
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

module.exports = router;
