const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const categorySchema = new Schema({
  name: { type: String, required: true , unique: true },
  displayOrder: { type: Number, required: true},
  isActive: { type: Boolean, default: true },
});

module.exports = mongoose.model("Category", categorySchema);
