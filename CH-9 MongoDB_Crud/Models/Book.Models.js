const mongoose = require('mongoose');

const BookSchema = mongoose.Schema({
    BookName: {
        type: String,
        required: true,
    },
    BookAuthor: {
        type: String,
        required: true
    },
    BookPrice: {
        type: Number,
        required: true,
    },
    BookLang: {
        type: String,
        required: true
    },
    BookImage: {
        type: String,
        required: true
    }
});

const Book = mongoose.model("Book", BookSchema, "Books");

module.exports = Book;