const express = require('express');
const router = express.Router();
const productController = require('../controller/productController');
const  JWTVarification  = require('../middleware/JWTVerification');

router.post('/add', productController.createProduct);
router.post('/purchase', productController.purchase);
// router.put('/purchaseUpdate/:id', productController.purchaseUpdate);
router.get('/all', productController.getProducts);
router.get('/allOrders',JWTVarification, productController.getOrders);
router.post('/create-payment-intent',JWTVarification, productController.createPaymentIntent);
router.put('/order/:id',JWTVarification, productController.updateOrder);
router.get('/order/:id',JWTVarification, productController.getOrderById);
router.get('/reviews', productController.getReviews);
router.get('/service', productController.getServices);
router.post('/add/review', productController.addReview);
router.get('/myitem/all', JWTVarification,productController.getAllProducts);
router.get('/:id', productController.getProductById);
router.put('/restock/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

module.exports = router;
