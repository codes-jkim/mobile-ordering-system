const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: { type: Number, required: true, min: 1, default: 1 },
});

const cartSchema = new Schema({
  items: [cartItemSchema],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Cart", cartSchema);
