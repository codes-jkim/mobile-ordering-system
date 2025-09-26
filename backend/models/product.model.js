const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  imageUrl: { type: String },
  description: { type: String },
  baseIngredients: [String],
  options: {
    removable: [{ name: String, price: Number }],
    addable: [{ name: String, price: Number }],
  },
  inStock: { type: Boolean, default: true },
});

module.exports = mongoose.model("Product", productSchema);
