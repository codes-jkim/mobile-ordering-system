const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: { type: Number, required: true, min: 1, default: 1 },
});

const orderSchema = new Schema({
  items: [orderItemSchema],
  totalPrice: { type: Number, required: true },
  status: { 
    type: String, 
    required: true,
    enum: ['preparing', 'completed', 'cancelled'],
    default: 'preparing'
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date },
});

orderSchema.pre('save', function(next) {
  if (this.isModified('status')) {
    this.updatedAt = Date.now();
  }
  next();
});

module.exports = mongoose.model("Order", orderSchema);
