const express = require ("express")
const router = express.Router()
const categoryController = require ("../controllers/categoryController")

router.get("/", categoryController.getCategories) // temukan kategori
router.post("/", categoryController.createCategory) // buat kirim  kategori ke tabel / buat kategori baru
router.get("/:id", categoryController.getCategoryById) // temukan kategori berdasarkan id
router.put("/:id", categoryController.updateCategory) // Edit data kategori berdasarkan id
router.delete("/:id", categoryController.deleteCategory) // Hapus kategori berdasarkan id

module.exports = router