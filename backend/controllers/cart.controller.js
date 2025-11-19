const Cart = require("../models/cart.model.js");
const asyncHandler = require("express-async-handler");
const AppError = require("../utils/AppError.js");

exports.createCart = asyncHandler(async (req, res) => {
  const { items } = req.body;
  const cart = new Cart({ items });
  await cart.save();
  await cart.populate("items.product");
  res.status(201).json(cart);
});

exports.updateCart = asyncHandler(async (req, res) => {
  const { items } = req.body;
  const { id } = req.params;
  const cart = await Cart.findById(id);
  if (!cart) {
    throw new AppError("Cart not found", 404);
  }

  let updatedCart;

  // check if items already exist in cart
  const existingItem = cart.items.find((item) =>
    item.product.equals(items.product)
  );

  // if exist, update quantity
  if (existingItem) {
    const newQuantity = existingItem.quantity + items.quantity;
    updatedCart = await Cart.findOneAndUpdate(
      { _id: id, "items.product": items.product },
      { $set: { "items.$.quantity": newQuantity } },
      { new: true }
    ).populate("items.product");
  } else {
    // else, add new item
    updatedCart = await Cart.findByIdAndUpdate(
      id,
      { $push: { items: items } },
      { new: true }
    ).populate("items.product");
  }
  res.status(200).json(updatedCart);
});

exports.updateQuantity = asyncHandler(async (req, res) => {
  const { id, productId } = req.params;
  const { quantity } = req.body;

  let updatedCart;

  if (quantity > 0) {
    updatedCart = await Cart.findOneAndUpdate(
      { _id: id, "items.product": productId },
      // set new quantity
      { $set: { "items.$.quantity": quantity } },
      { new: true } // return the updated document
    ).populate("items.product");
  } else {
    // if quantity is 0 or less, remove the item from the cart
    updatedCart = await Cart.findByIdAndUpdate(
      id,
      // remove all items from the items array where the product field matches productId
      { $pull: { items: { product: productId } } },
      { new: true }
    ).populate("items.product");
  }

  if (!updatedCart) {
    throw new AppError("Cart or Item not found", 404);
  }

  res.status(200).json(updatedCart);
});

exports.deleteCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findByIdAndDelete(req.params.id);
  if (!cart) {
    throw new AppError("Cart not found", 404);
  }
  res.status(200).json({ message: "Cart deleted successfully" });
});
