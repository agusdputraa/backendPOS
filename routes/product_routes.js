const express = require ("express")
const router = express.Router()
const productController =  require ("../controllers/productController")

router.get("/", productController.getProducts) // temukan produk
router.post("/", productController.createProduct) // buat kirim  produk ke tabel / buat data baru
router.get("/:id", productController.getProductById) // temukan produk berdasarkan id
router.put("/:id", productController.updateProduct) // Edit data produk berdasarkan id
router.delete("/:id", productController.deleteProduct) // Hapus Produk berdasarkan id

module.exports = router

