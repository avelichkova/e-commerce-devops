const Product = require('../models/Product');
const Joi = require('joi');

const productSchema = Joi.object({
    name: Joi.string().required().max(255),
    description: Joi.string().allow(''),
    price: Joi.number().positive().required(),
    category: Joi.string().max(100),
    stock_quantity: Joi.number().integer().min(0).default(0),
    image_url: Joi.string().uri().allow('')
});

const updateProductSchema = productSchema.fork(['name', 'price'], (schema) => schema.optional());

class ProductController {
    static async createProduct(req, res) {
        try {
            const  { error, value } = productSchema.validate(req.body);
            if (error) {
                return res.status(400).json({
                    success: false,
                    message: 'Validation error',
                    errors: error.details.map(detail => detail.message)
                });
            }

            const product = await Product.create(value);
            res.status(201).json({
                success: true,
                message: 'Product created successfully',
                datea: product
            });
        } catch (error) {
            console.error('Create product error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }

    static async getAllProducts(req, res) {
        try {
            const { category, minPrice, maxPrice, limit } = req.query;
            const filters = {};

            if (category) filters.category = category;
            if (maxPrice) filters.maxPrice = parseFloat(maxPrice);
            if (minPrice) filters.minPrice = parseFloat(minPrice);
            if (limit) filters.limit = parseInt(limit);

            const products = await Product.findAll(filters);
            res.json({
                success: true,
                message: 'Products retrieved successfully',
                data: products,
                count: products.length
            });
        } catch (error) {
            console.error('Get products error: ', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }

    static async getProductById(req, res) {
        try {
            const { id } = req.params;

            if (!id || isNaN(id)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid product ID'
                });
            }

            const product = await Product.findById(parseInt(id));

            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: 'Product not found'
                });
            }

            res.json({
                success: true,
                message: 'Product retrieved successfully',
                data: product
            });
        } catch (error) {
            console.error('Get product error: ', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }

    static async updateProduct(req, res) {
        try {
            const { id } = req.params;

            if (!id || isNaN(id)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid product ID'
                });
            }

            const { error, value } = updateProductSchema.validate(req.body);
            if (error) {
                return res.status(400).json({
                    success: false,
                    message: 'Validation error',
                    errors: error.details.map(detail => detail.message)
                });
            }

            const product = await Product.update(parseInt(id), value);

            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: 'Product not found'
                });
            }

            res.json({
                success: true,
                message: 'Produt updated successfully',
                data: product
            });
        } catch (error) {
            console.error('Update product error: ', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }

    static async deleteProduct(req, res) {
        try {
            const { id } = req.params;

            if (!id || isNaN(id)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid product ID'
                });
            }

            const product = await Product.delete(parseInt(id));

            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: 'Product not found'
                });
            }

            res.json({
                success: true,
                message: 'Produt deleted successfully'
            });
        } catch (error) {
            console.error('Delete product error: ', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    } 
}

module.exports = ProductController;