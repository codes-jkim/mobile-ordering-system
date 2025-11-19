const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/category.controller.js");

router.post("/", categoryController.createCategory);
router.get("/", categoryController.getAllCategories);
router.put("/", categoryController.updateCategory);
router.put("/reorder", categoryController.updateCategoryOrder);
router.patch("/:id/status", categoryController.updateCategoryStatus);
router.delete("/:id", categoryController.deleteCategory);

module.exports = router;
