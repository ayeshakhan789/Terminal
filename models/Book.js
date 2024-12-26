const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: { type: String, required: true },
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Author', required: true },
    publishedDate: { type: Date },
    availableCopies: { type: Number, required: true },
    totalCopies: { type: Number, required: true } // Keep track of the total number of copies
  });

// Custom validation for availableCopies
bookSchema.pre('save', function (next) {
  if (this.borrowedFrequency > 10 && this.availableCopies > 100) {
    return next(new Error('Available copies cannot exceed 100 when borrowing frequency is above 10.'));
  }
  next();
});

module.exports = mongoose.model('Book', bookSchema);
