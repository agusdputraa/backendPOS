
const db = require("../configs/db");
const fs = require('fs'); 
const path = require('path');

const getProducts = (req, res) => {
    const { search, category, sortBy, sortOrder, page, limit } = req.query;
    
    let query = `
        SELECT
            products.id,
            products.product_name,
            products.product_description,
            products.product_price,
            products.category_id,
            products.image, 
            categories.category_name 
        FROM 
            products
        LEFT JOIN
            categories ON products.category_id = categories.id`;
            
    const whereClauses = [];
    const params = [];

    if (search) {
        whereClauses.push("products.product_name LIKE ?");
        params.push(`%${search}%`);
    }
    if (category) {
        whereClauses.push("categories.id LIKE ?");
        params.push(`%${category}%`);
    }
    if (whereClauses.length > 0) {
        query += ` WHERE ${whereClauses.join(" AND ")}`;
    }
    if (sortBy && sortOrder) {
        query += ` ORDER BY ${sortBy} ${sortOrder}`;
    }

    const pageNumber = parseInt(page) || 1;
    const limitNumber = parseInt(limit) || 10;
    const offset = (pageNumber - 1) * limitNumber;

    query += " LIMIT ? OFFSET ?";
    params.push(limitNumber, offset);

    db.query(query, params, (error, result) => {
        if (error) return res.status(500).json({ error: error.message });

        const productsWithFullImageUrl = result.map(product => ({
            ...product,
            imageUrl: `${req.protocol}://${req.get('host')}/uploads/${product.image}`
        }));

        let countQuery = `
            SELECT COUNT(products.id) as total 
            FROM products
            LEFT JOIN categories ON products.category_id = categories.id`;
        
        if (whereClauses.length > 0) {
            countQuery += ` WHERE ${whereClauses.join(" AND ")}`;
        }
        const countParams = params.slice(0, whereClauses.length);

        db.query(countQuery, countParams, (error, countResult) => {
            if (error) return res.status(500).json({ error: error.message });

            const total = countResult[0].total;
            const totalPages = Math.ceil(total / limitNumber);

            res.status(200).json({
                total,
                totalPages,
                page: pageNumber,
                limit: limitNumber,
                data: productsWithFullImageUrl
            });
        });
    });
};

const createProduct = (req, res) => {
    const { product_name, product_description, product_price, category_id, imageUrl } = req.body;
    
    let imageName;
    if (req.file) {
        imageName = req.file.filename;
    } else if (imageUrl) {
        imageName = imageUrl;
    } else {
        imageName = 'default-image.png';
    }

    const query = "INSERT INTO products (product_name, product_description, product_price, category_id, image) VALUES (?, ?, ?, ?, ?)";
    const params = [product_name, product_description, product_price, category_id, imageName];
    
    db.query(query, params, (error, result) => {
        if (error) {
            return res.status(500).json({ error: error.message });
        }
        res.status(201).json({
            message: "Product created successfully",
            data: { id: result.insertId, image: imageName, ...req.body }
        });
    });
};

const getProductById = (req, res) => {
    const { id } = req.params;
    const query = "SELECT * FROM products WHERE id = ?";
    db.query(query, [id], (error, result) => {
        if (error) {
            return res.status(500).json({ error: error.message });
        }
        if (result.length === 0) {
            return res.status(404).json({ error: "Product not found" });
        }
        const productWithFullImageUrl = {
            ...result[0],
            imageUrl: `${req.protocol}://${req.get('host')}/uploads/${result[0].image}`
        };
        res.status(200).json(productWithFullImageUrl);
    });
};

const updateProduct = (req, res) => {
    const { id } = req.params;

    db.query("SELECT image FROM products WHERE id = ?", [id], (err, results) => {
        if (err) return res.status(500).json({ error: "Database error while finding the product." });
        if (results.length === 0) return res.status(404).json({ error: "Product not found." });

        const oldImageName = results[0].image;
        const { product_name, product_description, product_price, category_id, imageUrl } = req.body;
        
        let newImageName;
        if (req.file) {
            newImageName = req.file.filename;
        } else if (imageUrl) {
            newImageName = imageUrl;
        } else {
            newImageName = oldImageName;
        }        
        
        const setClauses = [];
        const params = [];

        if (product_name !== undefined) {
            setClauses.push("product_name = ?");
            params.push(product_name);
        }
        if (product_description !== undefined) {
            setClauses.push("product_description = ?");
            params.push(product_description);
        }
        if (product_price !== undefined) {
            setClauses.push("product_price = ?");
            params.push(product_price);
        }
        if (category_id !== undefined) {
            setClauses.push("category_id = ?");
            params.push(category_id);
        }

        if (req.file) {
            setClauses.push("image = ?");
            params.push(req.file.filename);
        }

        if (setClauses.length === 0) {
            return res.status(400).json({ message: "No data to update." });
        }

        const query = `UPDATE products SET ${setClauses.join(", ")} WHERE id = ?`;
        params.push(id);

        db.query(query, params, (error, result) => {
            if (error) return res.status(500).json({ error: error.message });
            if (result.affectedRows === 0) return res.status(404).json({ error: "Product not found during update." });

            const isOldImageLocal = !oldImageName.startsWith('http');
            if (req.file && oldImageName !== 'default-image.png' && isOldImageLocal) {
                const oldImagePath = path.join(__dirname, '..', 'uploads', oldImageName);
                fs.unlink(oldImagePath, (err) => {
                    if (err) console.log("Failed to delete old Image:", err)
                });
            }

            res.status(200).json({ message: "Product Successfully Updated." })
        })
    });
};


const deleteProduct = (req, res) => {
    const { id } = req.params;

    db.query("SELECT image FROM products WHERE id = ?", [id], (err, results) => {
        if (err || results.length === 0) return res.status(404).json({ error: "Product not found." });
        
        const imageName = results[0].image;
        const query = "DELETE FROM products WHERE id = ?";
        
        db.query(query, [id], (error, result) => {
            if (error) return res.status(500).json({ error: error.message });
            if (result.affectedRows === 0) return res.status(404).json({ error: "Product not found during deletion." });

            if (imageName !== 'default-image.png') {
                const imagePath = path.join(__dirname, '..', 'uploads', imageName);
                fs.unlink(imagePath, (err) => {
                    if (err) console.log("Failed to delete the image file:", err);
                });
            }
            res.status(200).json({ message: "Product deleted successfully." });
        });
    });
};

module.exports = {
    getProducts,
    createProduct,
    getProductById,
    updateProduct,
    deleteProduct
};
