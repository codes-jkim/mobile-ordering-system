const User = require("../models/admin.model");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const AppError = require("../utils/AppError");

exports.loginWithPassword = asyncHandler(async (req, res) => {
  const { password } = req.body;

  if (!password) {
    throw new AppError("Enter the password", 400);
  }

  const admin = await User.findOne({ username: "admin" });

  if (!admin) {
    throw new AppError("Admin account is not set up", 500);
  }

  // Check account lock
  if (admin.passwordFailAttempts && admin.passwordFailAttempts.lockedUntil) {
    const now = new Date();
    if (now < admin.passwordFailAttempts.lockedUntil) {
      throw new AppError(
        "The account is temporarily locked. Please try again later",
        403
      );
    }
  }

  // password verification
  const isValid = await admin.verifyPassword(password);

  if (!isValid) {
    // Increment failure count
    admin.passwordFailAttempts.count += 1;
    admin.passwordFailAttempts.lastAttempt = new Date();

    // Lock account if 5 failed attempts
    if (admin.passwordFailAttempts.count >= 5) {
      const lockTime = new Date();
      lockTime.setMinutes(lockTime.getMinutes() + 5);
      admin.passwordFailAttempts.lockedUntil = lockTime;
    }

    await admin.save();
    throw new AppError("Invalid password", 401);
  }

  // Reset failure count on success
  admin.passwordFailAttempts.count = 0;
  admin.passwordFailAttempts.lockedUntil = null;
  admin.lastLogin = new Date();
  await admin.save();

  // JWT token generation
  const token = jwt.sign({ userId: admin._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  const cookie = {
    expires: new Date(Date.now() + process.env.COOKIE_EXPIRES_IN * 60 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  };
  res.cookie("admin_token", token, cookie);
  res.status(200).json({
    status: "success",
    token,
    data: {
      _id: admin._id,
      username: admin.username,
    },
  });
});

exports.getAdmin = asyncHandler(async (req, res) => {
  const admin = req.admin;
  res.status(200).json(req.admin);
});

exports.logout = asyncHandler(async (req, res, next) => {
  res.cookie("admin_token", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: "Logged out successfully" });
});

exports.changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const admin = req.admin;
  
  const isValid = await admin.verifyPassword(currentPassword);
  if (!isValid) {
    throw new AppError("Current password is incorrect", 401);
  }

  admin.password = newPassword;
  await admin.save();

  res.status(200).json({
    success: true,
    message: "Password changed successfully",
  });
});

// initial admin account creation (for first-time setup)
exports.createInitialAdmin = asyncHandler(async (req, res) => {
  const adminExists = await User.findOne({ username: "admin" });

  if (adminExists) {
    return res.status(400).json({
      status: "error",
      message: "Admin account already exists",
    });
  }

  const admin = await User.create({
    username: "admin",
    pin: "1234",
  });

  res.status(201).json({
    status: "success",
    message:
      "Admin account has been created. Please change the PIN after first login.",
    data: {
      username: admin.username,
    },
  });
});
