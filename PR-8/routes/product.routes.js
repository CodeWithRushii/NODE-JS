const express = require('express');

const { addProductPage, addProduct, viewProductPage, deleteProduct, editProductPage, editProduct } = require('../controllers/product.controller');
const upload = require('../Middleware/product.multer.middleware');

const productRoute = express.Router();

productRoute.get('/addProductPage', addProductPage);
productRoute.post('/addProduct', upload.single('image'), addProduct);

productRoute.get('/viewProductPage', viewProductPage);

productRoute.get('/deleteProduct', deleteProduct);

productRoute.get('/editProductPage/:Id', editProductPage);
productRoute.post('/updateProduct/:Id', upload.single('image'), editProduct);

module.exports = productRoute;