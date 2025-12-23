require('./Config/db.Config');
const Product = require('./models/Product.Models');
const express = require('express');

const app = express();
const port = 9080;
app.set("view engine", "ejs");
app.use(express.static('Public'));

app.use(express.urlencoded());


app.get('/', async (req, res) => {
    const allProducts = await Product.find();

    return res.render('ViewProduct', { allProducts });
});

app.get('/AddProduct', (req, res) => {
    return res.render('AddProduct');
});

// Insert Product
app.post('/addProduct', async (req, res) => {


    const productAdded = await Product.create(req.body);
    if (productAdded) {
        return res.redirect('/');
    }
    else {
        console.log("Product not inserted...");
    }
});

app.post('/updateProduct', async (req, res) => {
    const updatedProduct = await Product.findByIdAndUpdate(req.body.id, req.body, { new: true });
    

    if (updatedProduct) {
        return res.redirect('/');
    }
    else {
        console.log("Product not Updated...");
    }
});


app.get('/EditProduct/:id', async (req, res) => {

    const product = await Product.findById(req.params.id);
    
    return res.render('EditProduct', { product });
});

// Delete Product

app.get('/DeleteProduct', async (req, res) => {

    const deletedProduct = await Product.findByIdAndDelete(req.query.id);
    if (deletedProduct) {
        console.log("Product deleted....");
        return res.redirect('/');
    }else {
        console.log("Product not deleted....");
    }
});

app.listen(port, (err) => {
    if (err) {
        console.log(err);
    }
    console.log("Server started");
});
