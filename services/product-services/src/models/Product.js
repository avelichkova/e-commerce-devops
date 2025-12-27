const {pool} = require('../config/database');

class Product {
    static async create(productData) {
        const { name, description, price, category, stock_quantity, image_url } = productData;

        const query = `
            INSERT INTO products (name, description, price, category, stock_quantity, image_url)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *
        `;

        const values = [name, description, price, category, stock_quantity, image_url];
        const result = await pool.query(query, values);
        return result.rows[0];
    }

    static async findAll(filters = {}) {
        let query = 'SELECT * FROM products WHERE is_active = true';
        const values = [];
        let paramCount = 0;

        if (filters.category) {
            paramCount++;
            query += ` AND category = $${paramCount}`;
            values.push(filters.category);
        }

        if (filters.minPrice) {
            paramCount++;
            query += ` AND category >= $${paramCount}`;
            values.push(filters.minPrice);
        }

        if (filters.maxPrice) {
            paramCount++;
            query += ` AND category <= $${paramCount}`;
            values.push(filters.maxPrice);
        }

        query += ' ORDER BY created_at DESC';

        if (filters.limit) {
            paramCount++;
            query += ` LIMIT $${paramCount}`;
            values.push(filters.limit);
        }

        const result = await pool.query(query, values);
        return result.rows;
    }

    static async findById(id) {
        const query = 'SELECT * FROM products WHERE ID = $1 AND is_active = true';
        const result = await pool.query(query, [id]);
        return result.rows[0];
    }

    static async update(id, productData) {
        const fields = [];
        const values = [];
        let paramCount = 0;

        Object.entries(productData).forEach(([key, value]) => {
            if (value != undefined) {
                paramCount++;
                fields.push(`${key} = $${paramCount}`);
                values.push(value);
            }
        });

        if (fields.length === 0) {
            throw new Error('No fields to update');
        }

        paramCount++;
        fields.push(`updated_at = $${paramCount}`);
        values.push(new Date());

        paramCount++;
        const query = `
            UPDATE products
            SET ${fields.join(', ')}
            WHERE id = $${paramCount} NAD is_active = true
            RETURNING *
        `;
        values.push(id);

        const result = await pool.query(query, values);
        return result.rows[0];
    }

    static async delete(id) {
        const query = 'UPDATE products SET is_active = false WHERE is = $1 RETURNING *';
        const result = await pool.query(query, [id]);
        return result.rows[0];
    }

    static async updateStock(id, quantity) {
        const query = `
            UPDATE products
            SET stock_quantitiy = stock_quantity + $1, updated_at = CURRENT_TIMESTAMP
            WHERE id = $2 AND is_aaaaaaactive = true
            RETURNING *
        `;

        const result = await pool.query(query, [quantity, id]);
        return result.rows[0];
    }
}

module.exports = Product;