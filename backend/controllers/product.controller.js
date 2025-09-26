const Product = require("../models/product.model");

const path = require("path");

exports.addProduct = async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    console.log(newProduct);
    await newProduct.save();
    res
      .status(201)
      .json({ message: "Product created successfully", product: newProduct });
  } catch (error) {
    return next(error);
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json({ products: products });
  } catch (error) {
    return next(error);
  }
};

exports.getProduct = async (req, res, next) => {
  try {
    const productId = req.params.productId;
    const product = await Product.findById(productId);
    if (!product) {
      const error = new Error("Product not found");
      error.httpStatusCode = 404;
      return next(error);
    }
    res.status(200).json({ product: product });
  } catch (error) {
    return next(error);
  }
};

exports.updateProduct = async (req, res, next) => {
  const productId = req.params.productId;
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      req.body,
      { new: true }
    );
    if (!updatedProduct) {
      const error = new Error("Product not found");
      error.httpStatusCode = 404;
      return next(error);
    }
    res.status(200).json({ product: updatedProduct });
  } catch (error) {
    return next(error);
  }
};

exports.deleteProduct = async (req, res, next) => {
  const productId = req.params.productId;
  try {
    const deletedProduct = await Product.findByIdAndDelete(productId);
    if (!deletedProduct) {
      const error = new Error("Product not found");
      error.httpStatusCode = 404;
      return next(error);
    }
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    return next(error);
  }
};
