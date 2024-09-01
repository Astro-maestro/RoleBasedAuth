const express = require('express');
const productController = require('../app/controller/product.controller');
const uploadProductImage = require('../app/helper/ProductImageUpload');
const  authCheck  = require('../app/middleware/auth');

const router = express.Router();

router.post('/create/product',authCheck, uploadProductImage.single('image'), productController.createProduct);
router.get('/get/product', productController.fetchAllProduct);
router.get('/get/product/:id', productController.fetchProductById);
router.get('/products/category/:categoryId', productController.fetchProductsByCategory);
router.put('/products/:id', authCheck, uploadProductImage.single('image'), productController.editProduct);
router.patch('/products/:id/toggle-active', authCheck, productController.toggleProductActiveStatus);
router.delete('/products/:id/delete', authCheck, productController.deleteProduct);

module.exports = router;