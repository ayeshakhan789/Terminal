require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const bookRoutes = require('./routes/books');
const authorRoutes = require('./routes/authors');
const borrowerRoutes = require('./routes/borrowers');




const app = express();

// Middleware
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Failed to connect to MongoDB', err));

// Routes
app.use('/books', bookRoutes);
app.use('/authors', authorRoutes);
app.use('/borrowers', borrowerRoutes);

app.listen(3000, () => {
    console.log('Server running on port 3000');
});

