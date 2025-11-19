const asyncHandler = require("express-async-handler");
const Category = require("../models/category.model.js");
const Product = require("../models/product.model.js");
const AppError = require("../utils/AppError.js");
const path = require("path");
const fs = require("fs");

exports.createCategory = asyncHandler(async (req, res) => {
  const category = new Category({
    name: req.body.name,
    displayOrder: req.body.displayOrder,
    isActive: req.body.isActive,
  });
  await category.save();
  res.status(201).json(category);
});

exports.updateCategory = asyncHandler(async (req, res) => {
  const { _id, name, displayOrder, isActive } = req.body;
  const category = await Category.findById(_id);
  if (!category) {
    throw new AppError("Category not found", 404);
  }
  category.name = name;
  category.displayOrder = displayOrder;
  category.isActive = isActive;
  await category.save();
  res.status(200).json(category);
});

exports.getAllCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find().sort({ displayOrder: 1 });
  res.status(200).json(categories);
});

exports.updateCategoryOrder = asyncHandler(async (req, res) => {
  const updatedCategories = req.body.categories;
  const bulkOps = updatedCategories.map((cat) => ({
    updateOne: {
      filter: { _id: cat._id },
      update: { displayOrder: cat.displayOrder },
    },
  }));

  await Category.bulkWrite(bulkOps);
  const categories = await Category.find().sort({ displayOrder: 1 });
  res.status(200).json(categories);
});

exports.updateCategoryStatus = asyncHandler(async (req, res) => {
  const categoryId = req.params.id;
  const { isActive } = req.body;

  const category = await Category.findById(categoryId);
  if (!category) {
    throw new AppError("Category not found", 404);
  }

  await Product.updateMany(
    { category: categoryId },
    { $set: { inStock: isActive } }
  );

  category.isActive = isActive;
  await category.save();

  res.status(200).json(category);
});

exports.deleteCategory = asyncHandler(async (req, res) => {
  const categoryId = req.params.id;
  const category = await Category.findById(categoryId);
  if (!category) {
    throw new AppError("Category not found", 404);
  }
  const productsToDelete = await Product.find({ category: categoryId });

  if (productsToDelete.length > 0) {
    productsToDelete.forEach((product) => {
      if (product.imageUrl) {
        const imagePath = path.join(
          __dirname,
          "..",
          "uploads",
          path.basename(product.imageUrl)
        );
        if (fs.existsSync(imagePath)) {
          fs.unlink(imagePath, (err) => {
            if (err) {
              console.error(
                `Failed to delete product image: ${imagePath}`,
                err
              );
            }
          });
        }
      }
    });
  }

  await Product.deleteMany({ category: categoryId });
  await Category.deleteOne({ _id: categoryId });

  res.status(200).json({ message: "Category deleted successfully" });
});
