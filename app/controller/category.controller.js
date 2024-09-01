const Category = require('../model/category.model');
const { productModel: Product } = require('../model/product.model');

class CategoryController {
    async createCategory(req, res) {
        try {
            if (req.user.isAdmin !== 'ADMIN') {
                return res.status(403).json({ message: 'Access denied. Only admins can create categories.' });
            }
            const { name } = req.body;
            const category = new Category({ name });
            await category.save();
    
            res.status(201).json({ message: 'Category created successfully', data: category });
        } catch (error) {
            res.status(500).json({ message: 'Error creating category', error: error.message });
        }
    }

    async getCategories(req, res) {
        try {
            const categories = await Category.find({});
            const categoriesWithCount = await Promise.all(categories.map(async (category) => {
                let productCount = 0;
                try {
                    // Make sure Product model is properly imported
                    if (Product && typeof Product.countDocuments === 'function') {
                        productCount = await Product.countDocuments({ category: category._id });
                    } else {
                        console.error('Product model is not properly defined or imported');
                    }
                } catch (countError) {
                    console.error('Error counting products:', countError);
                }
                return {
                    ...category.toObject(),
                    productCount
                };
            }));
            
            res.status(200).json(categoriesWithCount);
        } catch (error) {
            console.error('Error fetching categories:', error);
            res.status(500).json({ message: 'Error fetching categories', error: error.message });
        }
    }
}

module.exports = new CategoryController();
