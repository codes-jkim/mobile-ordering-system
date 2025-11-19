const Product = require("../models/product.model");
const Category = require("../models/category.model.js");
const fs = require("fs");
const path = require("path");
const asyncHandler = require("express-async-handler");
const AppError = require("../utils/AppError");

exports.addProduct = asyncHandler(async (req, res) => {
  const uploadedFile = req.file;

  try {
    if (!req.body.name || !req.body.price || !req.body.category) {
      if (uploadedFile) {
        const filePath = path.join(
          __dirname,
          "..",
          "uploads",
          uploadedFile.filename
        );
        fs.unlink(filePath, (err) => {
          if (err) console.error("Failed to delete uploaded file:", err);
        });
      }
      throw new AppError("name, price, category are required fields.", 400);
    }

    if (req.file) {
      req.body.imageUrl = `/images/${req.file.filename}`;
    }

    const categoryExists = await Category.findById(req.body.category);
    if (!categoryExists) {
      throw new AppError("The provided category does not exist.", 400);
    }

    const newProduct = new Product({
      name: req.body.name,
      price: parseInt(req.body.price, 10),
      category: req.body.category,
      description: req.body.description || "",
      imageUrl: req.body.imageUrl || "",
      inStock: req.body.inStock === "false" ? false : true,
    });

    await newProduct.save();

    const populatedProduct = await Product.findById(newProduct._id).populate(
      "category"
    );

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product: populatedProduct,
    });
  } catch (error) {
    if (uploadedFile) {
      const filePath = path.join(
        __dirname,
        "..",
        "uploads",
        uploadedFile.filename
      );
      fs.unlink(filePath, (err) => {
        if (err) console.error("Failed to delete uploaded file:", err);
      });
    }
    throw error;
  }
});

exports.getAllProducts = asyncHandler(async (req, res) => {
  const products = await Product.find().populate("category");
  res.status(200).json({ products: products });
});

exports.getProduct = asyncHandler(async (req, res, next) => {
  const productId = req.params.productId;
  const product = await Product.findById(productId).populate("category");
  if (!product) {
    throw new AppError("Product not found", 404);
  }
  res.status(200).json({ product: product });
});

exports.updateProduct = asyncHandler(async (req, res, next) => {
  const productId = req.params.productId;
  const uploadedFile = req.file;

  try {
    const existingProduct = await Product.findById(productId);
    if (!existingProduct) {
      if (uploadedFile) {
        const filePath = path.join(
          __dirname,
          "..",
          "uploads",
          uploadedFile.filename
        );
        fs.unlink(filePath, (err) => {
          if (err) console.error("Failed to delete uploaded file:", err);
        });
      }
      throw new AppError("Product not found", 404);
    }

    const updateData = { ...req.body };

    // if there is a new uploaded file, update imageUrl and delete old image file
    if (uploadedFile) {
      updateData.imageUrl = `/images/${uploadedFile.filename}`;

      // delete old image file if it exists
      if (existingProduct.imageUrl) {
        const oldImagePath = path.join(
          __dirname,
          "..",
          "uploads",
          existingProduct.imageUrl
        );

        fs.unlink(oldImagePath, (err) => {
          if (err) console.error("Failed to delete old image file:", err);
        });
      }
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      updateData,
      { new: true }
    ).populate("category");

    if (!updatedProduct) {
      throw new AppError("Product not found", 404);
    }
    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    if (uploadedFile) {
      const filePath = path.join(
        __dirname,
        "..",
        "uploads",
        uploadedFile.filename
      );
      fs.unlink(filePath, (err) => {
        if (err) console.error("Failed to delete uploaded file:", err);
      });
    }
    throw error;
  }
});

exports.deleteProduct = asyncHandler(async (req, res, next) => {
  const productId = req.params.productId;

  const productToDelete = await Product.findById(productId);
  if (!productToDelete) {
    throw new AppError("Product not found", 404);
  }

  if (productToDelete.imageUrl) {
    const filePath = path.join(
      __dirname,
      "..",
      "uploads",
      productToDelete.imageUrl
    );
    fs.unlink(filePath, (err) => {
      if (err) console.error("Failed to delete uploaded file:", err);
    });
  }
  const deletedProduct = await Product.findByIdAndDelete(productId);
  res.status(200).json({ message: "Product deleted successfully" });
});
