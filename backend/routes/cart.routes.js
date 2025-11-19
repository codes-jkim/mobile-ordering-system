const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cart.controller.js");

router.post("/", cartController.createCart);
router.put("/:id", cartController.updateCart);
router.delete("/:id", cartController.deleteCart);
router.patch("/:id/productId/:productId", cartController.updateQuantity);

module.exports = router;
