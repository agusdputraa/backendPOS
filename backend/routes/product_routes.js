const express = require ("express")
const router = express.Router()
const productController =  require ("../controllers/productController")
const { authenticateToken, authorizeSuperadmin } = require("../middleware/auth")
const upload = require("../middleware/upload")

router.get("/", productController.getProducts) // temukan produk
router.get("/:id", productController.getProductById) // temukan produk berdasarkan id
router.post("/", [authenticateToken, authorizeSuperadmin, upload.single(`image`)], productController.createProduct) // buat kirim  produk ke tabel / buat data baru (Dijaga Ketat)
router.put("/:id", [authenticateToken, authorizeSuperadmin, upload.single(`image`) ], productController.updateProduct) // Edit data produk berdasarkan id (Dijaga ketat)
router.delete("/:id", [authenticateToken, authorizeSuperadmin], productController.deleteProduct) // Hapus Produk berdasarkan id (Dijaga ketat)

module.exports = router

