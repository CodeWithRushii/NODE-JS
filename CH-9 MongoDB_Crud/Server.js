require('./Config/db.Config')
const Book = require('./models/Book.Models');
const express = require('express');

const app = express();

const port = 9080;

app.set("view engine", "ejs");

app.use(express.urlencoded());

app.get('/', async (req, res) => {

    const allBooks = await Book.find();

    return res.render('ViewBook', { allBooks });
});

app.get('/AddBook', (req, res) => {
    return res.render('AddBook');
});

// Insert Book
app.post('/addBook/:id', async (req, res) => {
    console.log(req.body);

    const BookAdded = await Book.create(req.body);
    if (BookAdded) {
        console.log("Book inserted...");

        return res.redirect('/');
    } else {
        console.log("Book not insertion...");
    }

});

app.post('/updateBook', async (req, res) => {
    const updatedBook = await Book.findByIdAndUpdate(req.body.id, req.body, { new: true });
    console.log(updatedBook);


    if (updatedBook) {
        console.log("Book Updated...");
        return res.redirect('/');
    } else {
        console.log("Book not Updated...");
    }
});


app.get('/EditBook/:id', async (req, res) => {

    const book = await Book.findById(req.params.id);

    return res.render('EditBook', { book });
});


// Delete Book

app.get('/DeleteBook', async (req, res) => {

    const deletedBook = await Book.findByIdAndDelete(req.query.id);
    if (deletedBook) {
        console.log("Book Deleted...");
        return res.redirect('/');
    } else {
        console.log("Book not Deleted...");
    }
});

app.listen(port, (err) => {
    if (err) {
        console.log(err);
    }
    console.log("Server is started");
});