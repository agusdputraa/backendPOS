Main: file mana yang pertama kali dijalankan
script: shortcut buat akan yang dijalankan
license: project license
type: pilihannya 2: commonjs dan module (perbedaannya dalam hal import module,package dan file )

commonjs -- require (buat manggil package)
module-- import .. from

"SELECT * FROM products" pilih data semua kolom(*) dan ambil dari (tabel) products
"SELECT product_name, product_price FROM products" kalau mau ambil sebagain

contoh statuscode
400 
500 
200 api success
201 success created

404 NOt found

Proses ngisi 
router.get("/", productController.getProducts)

.. (titik dua) keluar dari folder
. (titik satu) tetap di folder

const updateProduct = (req, res) => {
    const { id } = req.params
    const { product_name, product_description, product_price } = req.body
    const query = "UPDATE products SET product_name = ?, product_description = ?, product_price = ? WHERE id = ?"
    db.query(query, [product_name, product_description, product_price, id], (error, result) => {
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
            id,
            product_name,
            product_description,
            product_price
        })
    })
}