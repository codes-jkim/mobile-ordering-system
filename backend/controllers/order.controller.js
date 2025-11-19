const asyncHandler = require("express-async-handler");
const Order = require("../models/order.model.js");
const AppError = require("../utils/AppError.js");

exports.createOrder = asyncHandler(async (req, res) => {
  const order = new Order({
    items: req.body.items,
    totalPrice: req.body.totalPrice,
    status: "preparing",
  });
  await order.save();
  await order.populate("items.product");
  res.status(201).json(order);
});

exports.getAllOrders = asyncHandler(async (req, res) => {
  const { date } = req.query;
  let query = {};

  if (date) {
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);

    query = {
      createdAt: {
        $gte: startDate,
        $lte: endDate,
      },
    };
  }
  const orders = await Order.find(query).populate("items.product");
  res.status(200).json(orders);
});

exports.updateOrderStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const order = await Order.findByIdAndUpdate(
    id,
    { status },
    { new: true, runValidators: true }
  ).populate("items.product");

  if (!order) {
    throw new AppError("Order not found", 404);
  }
  res.status(200).json(order);
});

exports.getDashboardStats = asyncHandler(async (req, res) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const oneWeekAgo = new Date(today);
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const oneMonthAgo = new Date(today);
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

  const dailyOrders = await Order.countDocuments({
    createdAt: { $gte: today },
  });

  // orders in the past week
  const weeklyOrders = await Order.countDocuments({
    createdAt: { $gte: oneWeekAgo },
  });

  // orders in the past month
  const monthlyOrders = await Order.countDocuments({
    createdAt: { $gte: oneMonthAgo },
  });
  const dailyRevenueResult = await Order.aggregate([
    { $match: { createdAt: { $gte: today } } },
    { $group: { _id: null, total: { $sum: "$totalPrice" } } },
  ]);
  const dailyRevenue =
    dailyRevenueResult.length > 0 ? dailyRevenueResult[0].total : 0;

  // this week's revenue
  const weeklyRevenueResult = await Order.aggregate([
    { $match: { createdAt: { $gte: oneWeekAgo } } },
    { $group: { _id: null, total: { $sum: "$totalPrice" } } },
  ]);
  const weeklyRevenue =
    weeklyRevenueResult.length > 0 ? weeklyRevenueResult[0].total : 0;

  const topProductsByCategory = await Order.aggregate([
    { $match: { createdAt: { $gte: oneMonthAgo } } },
    { $unwind: "$items" },
    {
      $lookup: {
        from: "products",
        localField: "items.product",
        foreignField: "_id",
        as: "productInfo",
      },
    },
    { $unwind: "$productInfo" },
    {
      $group: {
        _id: {
          category: "$productInfo.category",
          productId: "$items.product",
          name: "$productInfo.name",
          imageUrl: "$productInfo.imageUrl",
        },
        soldCount: { $sum: "$items.quantity" },
      },
    },
    { $sort: { soldCount: -1 } },
    {
      $group: {
        _id: "$_id.category",
        products: {
          $push: {
            productId: "$_id.productId",
            name: "$_id.name",
            imageUrl: "$_id.imageUrl",
            soldCount: "$soldCount",
          },
        },
      },
    },
    {
      $lookup: {
        from: "categories",
        localField: "_id",
        foreignField: "_id",
        as: "categoryInfo",
      },
    },
    {
      $unwind: "$categoryInfo",
    },
    {
      $project: {
        category: "$categoryInfo.name",
        topProducts: { $slice: ["$products", 5] },
        _id: 0,
      },
    },
  ]);

  const salesByDate = await Order.aggregate([
    { $match: { createdAt: { $gte: oneWeekAgo } } },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        total: { $sum: "$totalPrice" },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
    { $project: { date: "$_id", total: 1, count: 1, _id: 0 } },
  ]);

  res.status(200).json({
    dailyOrders,
    weeklyOrders,
    dailyRevenue,
    weeklyRevenue,
    topProductsByCategory,
    salesByDate,
  });
});
