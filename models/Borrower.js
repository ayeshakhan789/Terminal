const mongoose = require('mongoose');

const borrowerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  borrowedBooks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Book' }],
  membershipActive: { type: Boolean, required: true },
  membershipType: { 
    type: String, 
    enum: ['Standard', 'Premium'], 
    required: true 
  },
});

// Custom validation for borrowing limits
borrowerSchema.pre('save', function (next) {
  const maxBooks = this.membershipType === 'Premium' ? 10 : 5;
  if (this.borrowedBooks.length > maxBooks) {
    return next(new Error(`A ${this.membershipType} member cannot borrow more than ${maxBooks} books.`));
  }
  next();
});

module.exports = mongoose.model('Borrower', borrowerSchema);
