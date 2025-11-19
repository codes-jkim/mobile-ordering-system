const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema({
  name: { type: String, required: true },
  category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
  price: { type: Number, required: true },
  imageUrl: { type: String },
  description: { type: String },
  inStock: { type: Boolean, default: true },
});

module.exports = mongoose.model("Product", productSchema);
