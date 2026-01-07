require('./config/db.config');
const express = require('express');
const Book = require("./Models/Book.Models");
const multer = require('multer');
const path = require('path')
const fs = require('fs');

const PORT = 9000;
const app = express();

app.set('view engine', 'ejs');

// Middleware
app.use(express.urlencoded());
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Table Route
app.get('/', async (req, res) => {

    // All Book Fetch
    const allBooks = await Book.find();

    return res.render('viewBook', { allBooks });
});

// Add Book 
app.get('/addBook', (req, res) => {
    return res.render('AddBook');
});

// Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    }
});

// Image Middleware
const upload = multer({ storage });

// Insert Book 
app.post('/addBook', upload.single('BookImage'), async (req, res) => {

    if (!req.file) {
        console.log("No file uploaded");
        return res.redirect('/');
    }

    req.body.BookImage = req.file.path;

    await Book.create(req.body);
    return res.redirect('/');
});


// Edit Book
app.get('/editBook/:bookId', async (req, res) => {
    console.log(req.params);
    const book = await Book.findById(req.params.bookId);

    console.log(book);

    if (book) {
        return res.render('EditBook', { book });
    } else {
        return res.redirect('/');
    }
});

// Update Book 
app.post('/updateBook', upload.single('BookImage'), async (req, res) => {
    console.log(req.body);

    console.log(req.file);

    if (req.file) {
        const bookData = await Book.findById(req.body.id);

        fs.unlink(bookData.BookImage, (err) => { });

        req.body.BookImage = req.file.path;

        const updatedData = await Book.findByIdAndUpdate(req.body.id, req.body, { new: true });

        console.log("Update : ", updatedData);

    } else {
        const updatedData = await Book.findByIdAndUpdate(req.body.id, req.body, { new: true });

        console.log("Update : ", updatedData);
    }

    return res.redirect('/');
});

// Delete Book 
app.get('/deleteBook', async (req, res) => {
    console.log(req.query);

    console.log(req.query.bookId);
    const deletedBook = await Book.findByIdAndDelete(req.query.id);

    console.log("Deleted Book : ", deletedBook);

    fs.unlink(deletedBook.BookImage, (err) => { });

    if (deletedBook) {
        console.log("Book deleted successfully...");
    } else {
        console.log("Book deletion failed...");
    }
    return res.redirect('/');
});

app.listen(PORT, (err) => {
    if (err) {
        console.log("Server is not started..", err);
        return;
    }
    console.log("Server is strated 😂");
});