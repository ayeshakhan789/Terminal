const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'Author', required: true },
  isbn: { type: String, unique: true, required: true },
  availableCopies: { type: Number, required: true, min: 0 },
  borrowedFrequency: { type: Number, default: 0 }, // Track how many times a book has been borrowed
});

// Custom validation for availableCopies
bookSchema.pre('save', function (next) {
  if (this.borrowedFrequency > 10 && this.availableCopies > 100) {
    return next(new Error('Available copies cannot exceed 100 when borrowing frequency is above 10.'));
  }
  next();
});

module.exports = mongoose.model('Book', bookSchema);
