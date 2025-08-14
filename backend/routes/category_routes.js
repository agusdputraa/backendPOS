const express = require ("express")
const router = express.Router()
const categoryController = require ("../controllers/categoryController")
const { authenticateToken, authorizeSuperadmin } = require("../middleware/auth")

router.get("/", categoryController.getCategories) // temukan kategori
router.post("/", [authenticateToken, authorizeSuperadmin], categoryController.createCategory) // buat kirim  kategori ke tabel / buat kategori baru
router.get("/:id", categoryController.getCategoryById) // temukan kategori berdasarkan id
router.put("/:id", [authenticateToken, authorizeSuperadmin], categoryController.updateCategory) // Edit data kategori berdasarkan id
router.delete("/:id", [authenticateToken, authorizeSuperadmin], categoryController.deleteCategory) // Hapus kategori berdasarkan id

module.exports = router