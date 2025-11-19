const express = require("express");
const router = express.Router();
const orderController = require("../controllers/order.controller.js");

router.post("/", orderController.createOrder);
router.get("/", orderController.getAllOrders);
router.put("/status/:id", orderController.updateOrderStatus);
router.get('/stats', orderController.getDashboardStats);

module.exports = router;
