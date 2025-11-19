const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin.controller.js");
const { checkAuth } = require("../middleware/auth.js");

router.post("/", adminController.loginWithPassword);
router.put("/change-password", checkAuth, adminController.changePassword);
router.get("/info", checkAuth, adminController.getAdmin);
router.get("/logout", checkAuth, adminController.logout);

// Initial admin creation route
router.post("/init-admin", adminController.createInitialAdmin);

module.exports = router;
