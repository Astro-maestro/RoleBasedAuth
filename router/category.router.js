const express = require('express');
const router = express.Router();
const categoryController = require('../app/controller/category.controller');
const  authCheck  = require('../app/middleware/auth');


// Route to create a new category
router.post('/categories',authCheck, categoryController.createCategory);
// Route to get all categories with the count of products
router.get('/categories', categoryController.getCategories);

module.exports = router;
