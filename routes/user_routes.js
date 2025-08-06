const express = require("express");
const router = express.Router(); 
const userController = require("../controllers/userController");
const { authenticateToken, authorizeSuperadmin } = require("../middleware/auth")

router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);
router.get("/", [authenticateToken, authorizeSuperadmin], userController.getUsers);
router.put("/profile", authenticateToken, userController.updateUserProfile);
router.put("/password", authenticateToken, userController.updateUserPassword);
router.delete("/:id", [authenticateToken, authorizeSuperadmin], userController.deleteUser);
router.patch("/:id/role", [authenticateToken, authorizeSuperadmin], userController.updateUserRole);


module.exports = router;