const mongoose = require('mongoose');

const authorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { 
    type: String, 
    unique: true, 
    required: true, 
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // Simple email validation
  },
  phoneNumber: { 
    type: String, 
    required: true, 
    match: /^\+?\d{10,15}$/, // Simple phone number validation
  },
  books: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Book' }], // Books authored by this author
});

// Custom validation for book count
authorSchema.pre('save', function (next) {
  if (this.books.length > 5) {
    return next(new Error('An author cannot be linked to more than 5 books.'));
  }
  next();
});

// Add a method to get the number of books linked to an author
authorSchema.methods.getBookCount = function () {
    return this.model('Book').countDocuments({ authorId: this._id });
  };

module.exports = mongoose.model('Author', authorSchema);
