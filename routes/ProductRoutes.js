const express = require('express');
const router = express.Router();
const productController = require('../controller/productController');
const  JWTVarification  = require('../middleware/JWTVerification');

router.post('/add', productController.createProduct);
router.get('/all', productController.getProducts);
router.get('/reviews', productController.getReviews);
router.get('/myitem/all', JWTVarification,productController.getAllProducts);
router.get('/:id', productController.getProductById);
router.put('/restock/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

module.exports = router;
