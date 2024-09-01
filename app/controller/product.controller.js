const { productModel, productSchemavalidation } = require('../model/product.model');
const Category = require('../model/category.model');
const path = require('path');


class ProductController {
    async createProduct(req, res) {
        try {
            if (req.user.isAdmin !== 'ADMIN') {
                return res.status(403).json({ message: 'Access denied. Only admins can create products.' });
            }

            const { error, value } = productSchemavalidation.validate(req.body);
            if (error) {
                return res.status(400).json({ message: error.details[0].message });
            }

            const { name, price, description, stock, category, sizes } = value;

            const categoryExists = await Category.findById(category);
            if (!categoryExists) {
                return res.status(400).json({ message: 'Invalid category ID' });
            }
    
            const image = req.file ? req.file.filename : 'https://www.pngitem.com/pimgs/m/150-1503945_transparent-user-png-default-user-image-png-png.png';

            const product = new productModel({
                name,
                price,
                description,
                stock,
                category,
                sizes,
                image: image 
            });
            await product.save();

            res.status(201).json({ message: 'Product created successfully', data: product });
        } catch (error) {
            res.status(500).json({ message: 'Error creating product', error: error.message });
        }
    }
    

    async fetchAllProduct(req, res) {
        try {
            const resp = await productModel.find({ isActive: true }).populate('category', 'name');
            if (resp.length > 0) {
                res.status(200).json({
                    message: 'All products are fetched successfully!',
                    total: resp.length,
                    data: resp
                });
            } else {
                res.status(200).json({
                    message: 'No products found.',
                    total: 0,
                    data: []
                });
            }
        } catch (error) {
            console.log('Error while fetching all products: ', error);
            res.status(500).json({
                message: 'Error fetching products',
                error: error.message
            });
        }
    }

    async fetchProductById(req, res) {
        try {
            const id = req.params.id;
            const resp = await productModel.findById(id).populate('category', 'name'); 
            if (resp) {
                res.status(200).json({
                    message: 'Product fetched successfully!',
                    data: resp
                });
            } else {
                res.status(404).json({
                    message: 'Product not found.',
                    data: null
                });
            }
        } catch (error) {
            console.log('Error while fetching product: ', error);
            res.status(500).json({
                message: 'Error fetching product',
                error: error.message
            });
        }
    }

    async fetchProductsByCategory(req, res) {
        try {
            const categoryId = req.params.categoryId;
            const products = await productModel
                .find({ category: categoryId, isActive: true})
                .populate('category', 'name'); 

            if (products.length > 0) {
                res.status(200).json({
                    message: 'Products fetched successfully!',
                    total: products.length,
                    data: products
                });
            } else {
                res.status(404).json({
                    message: 'No products found for the specified category.',
                    total: 0,
                    data: []
                });
            }
        } catch (error) {
            console.log('Error while fetching products by category: ', error);
            res.status(500).json({
                message: 'Error fetching products by category',
                error: error.message
            });
        }
    }

    async editProduct(req, res) {
        try {

            if (req.user.isAdmin !== 'ADMIN') {
                return res.status(403).json({ message: 'Access denied. Only admins can edit products.' });
            }

            const id = req.params.id;

            const { error } = productSchemavalidation.validate(req.body);
            if (error) {
                return res.status(400).json({ message: error.details[0].message });
            }

            const image = req.file ? req.file.filename : null;
            const updateData = {
                ...req.body,
                image: image ? path.join('uploads', image) : undefined 
            };

            const updatedProduct = await productModel.findByIdAndUpdate(
                id,
                updateData,
                { new: true, runValidators: true }
            );

            if (updatedProduct) {
                res.status(200).json({
                    message: 'Product updated successfully!',
                    data: updatedProduct
                });
            } else {
                res.status(404).json({
                    message: 'Product not found.',
                    data: null
                });
            }
        } catch (error) {
            console.log('Error while updating product: ', error);
            res.status(500).json({
                message: 'Error updating product',
                error: error.message
            });
        }
    }

    async toggleProductActiveStatus(req, res) {
        try {

            if (req.user.isAdmin !== 'ADMIN') {
                return res.status(403).json({ message: 'Access denied. Only admins can toggle product status.' });
            }

            const id = req.params.id;

            const product = await productModel.findById(id);
    
            if (!product) {
                return res.status(404).json({ message: 'Product not found!' });
            }

            product.isActive = !product.isActive;

            await product.save();

            res.status(200).json({
                message: 'Product status updated successfully!',
                data: product
            });
        } catch (error) {
            console.error('Error while toggling product status:', error);
            res.status(500).json({ message: 'Error updating product status', error: error.message });
        }
    }

    async deleteProduct(req, res) {
        try {

            if (req.user.isAdmin !== 'ADMIN') {
                return res.status(403).json({ message: 'Access denied. Only admins can delete products.' });
            }
    
            const id = req.params.id;

            const deletedProduct = await productModel.findByIdAndDelete(id);
    
            if (!deletedProduct) {
                return res.status(404).json({ message: 'Product not found!' });
            }

            res.status(200).json({
                message: 'Product deleted successfully!',
                data: deletedProduct
            });
        } catch (error) {
            console.error('Error while deleting product:', error);
            res.status(500).json({ message: 'Error deleting product', error: error.message });
        }
    }
    
}

module.exports = new ProductController();
