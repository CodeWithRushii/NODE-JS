const express = require('express');
const controller = require('../controllers/product.controller');

const multer = require('multer');



const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage });

const router = express.Router();

router.get('/', controller.viewProduct);
router.get('/addProduct', controller.productFormPage);
router.post('/addProduct', upload.single('image'), controller.addProduct);
router.get('/deleteProduct', controller.deleteProduct);
router.get('/editProduct/:id', controller.editProductPage);
router.post('/updateProduct', upload.single('image'), controller.updateProduct);

module.exports = router;
