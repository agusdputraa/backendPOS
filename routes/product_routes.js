const express = require ("express")
const router = express.Router()
const productController =  require ("../controllers/productController")
const { authenticateToken, authorizeSuperadmin } = require("../middleware/auth")

router.get("/", productController.getProducts) // temukan produk
router.get("/:id", productController.getProductById) // temukan produk berdasarkan id
router.post("/", [authenticateToken, authorizeSuperadmin], productController.createProduct) // buat kirim  produk ke tabel / buat data baru (Dijaga Ketat)
router.put("/:id", [authenticateToken, authorizeSuperadmin], productController.updateProduct) // Edit data produk berdasarkan id (Dijaga ketat)
router.delete("/:id", [authenticateToken, authorizeSuperadmin], productController.deleteProduct) // Hapus Produk berdasarkan id (Dijaga ketat)

module.exports = router

