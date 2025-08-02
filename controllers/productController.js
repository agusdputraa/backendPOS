const db = require ("../configs/db")

const getProducts = (req, res) => {
    const {
        search,
        category,
        sortBy,
        sortOrder,
        page,
        limit
    } = req.query
    req.query.search

    let query = `
        SELECT
            products.id,
            products.product_name,
            products.product_description,
            products.product_price,
            products.category_id,
            categories.category_name 
        FROM 
            products
        LEFT JOIN
            categories ON products.category_id = categories.id`
            
    const whereClauses = []
    const params = []

    if (search) {
        whereClauses.push("products.product_name LIKE ?")
        params.push(`%${search}%`)
    }

    if (category) {
        whereClauses.push("categories.id LIKE ?")
        params.push(`%${category}%`)
    }

    if (whereClauses.length > 0) {
        query += ` WHERE ${whereClauses.join(" AND ")}`
    }

    if (sortBy && sortOrder) {
        query += ` ORDER BY ${sortBy} ${sortOrder}`
    }

    const pageNumber = parseInt(page) || 1
    const limitNumber = parseInt(limit) || 10
    const offset = (pageNumber - 1) * limitNumber

    query += " LIMIT ? OFFSET ?"
    params.push(limitNumber, offset)

    db.query(query, params, (error, result) => {
        if (error) return res.status(500).json({
            error: error.message
        })

    let countQuery = `
        SELECT COUNT (products.id) as total 
        FROM products
        LEFT JOIN categories ON products.category_id = categories.id`
    
        if (whereClauses.length > 0) {
        countQuery += ` WHERE ${whereClauses.join(" AND ")}`
        }

    const countParams = params.slice(0, whereClauses.length)

        db.query(countQuery, countParams, (error, countResult) => {
            if (error) return res.status(500).json({
                error: error.message
            })

            const total = countResult[0].total
            const totalPages = Math.ceil(total / limitNumber)

            res.status(200).json({
                total,
                totalPages,
                page: pageNumber,
                limit: limitNumber,
                data: result
            })
        })
    })
}

const createProduct = (req, res) => {
    const { product_name, product_description, product_price, category_id} = req.body
    const query = "INSERT INTO products (product_name, product_description, product_price, category_id) VALUES (?, ?, ?, ?)"
    db.query(query, [product_name, product_description, product_price, category_id], (error, result) => {
        if (error) {
            return res.status(500).json({
                error: error.message
            })
        }
        res.status(201).json({
            id: result.insertId,
            product_name,
            product_description,
            product_price,
            category_id
        })
    })
}

const getProductById = (req, res) => {
    const { id } = req.params
    const query = "SELECT * FROM products WHERE id = ?"
    db.query(query, [id], (error, result) => {
        if (error) {
            return res.status(500).json({
                error: error.message
            })
        }
        if (result.length === 0) {
            return res.status(404).json({
                error: "Product not found"
            })
        }
        res.status(200).json(result[0])
    })
}

const updateProduct = (req, res) => {
    const { id } = req.params
    const { product_name, product_description, product_price, category_id } = req.body
 
    const setClauses = [] 
    const params = []

    if (product_name !== undefined) {
        setClauses.push("product_name =?")
        params.push(product_name)
    }

    if (product_description !== undefined) {
        setClauses.push("product_description =?")
        params.push(product_description)
    }

    if (product_price !== undefined) {
        setClauses.push("product_price =?")
        params.push(product_price)
    }

        if (category_id !== undefined) {
        setClauses.push("category_id =?")
        params.push(category_id)
    }

    if (setClauses.length === 0) {
        return res.status(400).json({
            message: "No data Updated"
        })
    }

    const query = `UPDATE products SET ${setClauses.join(", ")} WHERE id =?` 
    params.push(id)

    db.query(query, params, (error, result) => {
        if (error) {
            return res.status(500).json({
                error: error.message
            })
        }
        if (result.affectedRows === 0) {
            return res.status(404).json ({
                error: error.message
            })
        }
        res.status(200).json({
            message: "Product updated succesfully",
            data: req.body
        })
    })
}

const deleteProduct = (req, res) => {
    const { id } = req.params
    const query = "DELETE FROM products WHERE id = ?"
    db.query(query, [id], (error, result) => {
        if (error) {
            return res.status(500).json({
                error: error.message
            })
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({
                error: "Product not found"
            })
        }
        res.status(200).json({
            message: "Product deleted successfully"
        })
    })
}

module.exports = {
    getProducts,
    createProduct,
    getProductById,
    updateProduct,
    deleteProduct
}
