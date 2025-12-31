const ProductController = require('../../controllers/productController');
const Product = require('../../models/Product');

jest.mock('../../models/Product');

describe('ProductController.getAllProducts', () => {
    let req;
    let res;

    beforeEach(() => {
        req = {
            query: {}
        };

        res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis()
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return products with filters applied', async () => {
        req.query = {
            category: 'electronics',
            minPrice: '100',
            maxPrice: '500'
        };

        const mockProducts = [
            { id: 1, name: 'Phone' },
            { id: 2, name: 'Tablet' }
        ];

        Product.findAll.mockResolvedValue(mockProducts);

        await ProductController.getAllProducts(req, res);

        expect(Product.findAll).toHaveBeenCalledWith({
            category: 'electronics',
            minPrice: 100,
            maxPrice: 500
        });

        expect(res.json).toHaveBeenCalledWith({
            success: true,
            message: 'Products retrieved successfully',
            data: mockProducts,
            count: mockProducts.length
        });
    });

    it('should return empty list when no products found', async () => {
        Product.findAll.mockResolvedValue([]);

        await ProductController.getAllProducts(req, res);

        expect(res.json).toHaveBeenCalledWith({
            success: true,
            message: 'Products retrieved successfully',
            data: [],
            count: 0
        });
    });

    it('should handle errors and return 500', async () => {
        Product.findAll.mockRejectedValue(new Error('DB error'));

        await ProductController.getAllProducts(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: 'Internal server error'
        });
    });
});
