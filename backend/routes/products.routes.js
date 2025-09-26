const path = require("path");

const express = require("express");

const router = express.Router();

const productController = require("../controllers/product.controller");

router.get("/", productController.getAllProducts);
router.get("/:productId", productController.getProduct);
router.post("/add-product", productController.addProduct);
router.put("/:productId", productController.updateProduct);
router.delete("/:productId", productController.deleteProduct);

module.exports = router;
