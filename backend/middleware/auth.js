const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const AppError = require("../utils/AppError");
const Admin = require("../models/admin.model.js");

exports.checkAuth = asyncHandler(async (req, res, next) => {
  let token;

  if (req.cookies.admin_token) {
    token = req.cookies.admin_token;
  }
  
  if (!token) {
    return next(new AppError("Not authorized, token missing", 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const admin = await Admin.findById(decoded.userId);
    if (!admin) {
      throw new AppError(
        "The admin account no longer exists.",
        401
      );
    }

    req.admin = admin;
    next();
  } catch (error) {
    throw new AppError("Not authorized, token failed", 401);
  }
});
