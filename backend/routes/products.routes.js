const path = require("path");
const express = require("express");
const router = express.Router();
const { checkAuth } = require("../middleware/auth.js");
const productController = require("../controllers/product.controller");

router.get("/", productController.getAllProducts);
router.post("/", checkAuth, productController.addProduct);
router.get("/:productId", productController.getProduct);
router.put("/:productId", checkAuth, productController.updateProduct);
router.delete("/:productId", checkAuth, productController.deleteProduct);

module.exports = router;
