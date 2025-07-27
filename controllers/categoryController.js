const db = require ("../configs/db")

// karena kemarin sudah praktik desctructuring, mari kita buat yang manual
const getCategories = (req, res) => {
    const search = req.query.search
    const sortBy = req.query.sortBy
    const sortOrder = req.query.sortOrder
    const page = req.query.page
    const limit = req.query.limit


    let query = "SELECT * FROM categories" // ambil semua data dari tabel categories
    const params = [] // simpan parameter untuk wadah menyimpan query

    //masuk ke logicnya
    //search
    if (search) {
        query += " WHERE category_name LIKE ?" 
        params.push(`%${search}%`)
    }

    //sorting
    if (sortBy && sortOrder) {
        query += `ORDER BY ${sortBy} ${sortOrder}`
    }

    //pagination
    const pageNumber = parseInt(page) || 1
    const limitNumber = parseInt(limit) || 5
    const offset = (pageNumber - 1) * limitNumber

    query += " LIMIT ? OFFSET ?"
    params.push(limitNumber, offset)

    //menampilkan isi query

    db.query(query, params, (error, result) => {
        if (error) return res.status(500).json({
            error: error.message
        })

        let countQuery = "SELECT COUNT (*) as total FROM categories"
        const countParams = []

        if (search) {
            countQuery += " WHERE category_name LIKE ?"
            countParams.push(`%${search}%`)

        }


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

//Query untuk buat category baru
const createCategory = (req, res) => {
    const {category_name} = req.body 
    const query = "INSERT INTO categories (category_name) VALUES (?)"
    
    //jalankan query buat kategori
    db.query(query, [category_name], (error, result) => {
        if (error) {
            return res.status(500).json({
                error: error.message
            })
        }
        res.status(201).json({
            id: result.insertId,
            category_name
        })
    })
}

//query untuk ambil/dapatkan data kategori berdasarkan id kategori
const getCategoryById = (req, res) => {
    const {id} = req.params
    const query = "SELECT * FROM categories WHERE id = ?"

    //jalankan query getbyID
    db.query(query, [id], (error, result) => {
        if (error) {
            return res.status(500).JSON({
                error: error.message
            })
        }
        if (result.length === 0) {
            return res.status (404).json({
                error: "Category not found"
            })
        }
        res.status(200).json(result[0])
    })
}

// Siapkan bahan untuk query update 
const updateCategory = (req,res) => {
    const { id } = req.params
    const { category_name } = req.body
 
    const setClauses = [] 
    const params = []

    // kasih rule satu-persatu mana yang akan di skip jika kosong
    if (category_name !== undefined) {
        setClauses.push("category_name =?")
        params.push(category_name)
    }

    // kasih rule untuk hitung yang ada isinya
    if (setClauses.length === 0) {
        return res.status(400).json({
            message: "No category data Updated"
        })
    }

    // Buat query untuk update isi tabel kategori (pake modifikasi supaya hanya update apa yang dituliskan)
    const query = `UPDATE categories SET ${setClauses.join(", ")} WHERE id =?` 
    params.push(id)

    // Jalankan query update
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
            message: "category updated succesfully",
            data: req.body
        })
    })
}


//Buat query delete
const deleteCategory = (req, res) => {
    const {id} = req.params
    const query = "DELETE FROM categories WHERE id =?"

    //jalankan query delete
    db.query(query, [id], (error, result) => {
        if (error) {
            return res.status(500).json({
                error: error.message
            })
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({
                error: "Category not found"
            })
        }
        res.status(200).json({
            message: "category deleted successfully"
        })
    })
}

module.exports = {
    getCategories,
    createCategory,
    getCategoryById,
    updateCategory,
    deleteCategory
}