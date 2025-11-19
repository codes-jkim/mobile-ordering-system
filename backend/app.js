const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const path = require("path");
const fs = require("fs");
const multer = require("multer");

const mongoose = require("mongoose");
const cors = require("cors");

const port = process.env.PORT || 3000;

const productsRoute = require("./routes/products.routes");
const cartRoutes = require("./routes/cart.routes.js");
const orderRoutes = require("./routes/order.routes.js");
const adminRouter = require("./routes/admin.routes.js");
const categoryRouter = require("./routes/category.route.js");

const app = express();

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/images");
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production" ? true : "http://localhost:4200",
    credentials: true,
  })
);
app.use(cookieParser());
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single("image")
);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const dotenv = require("dotenv");
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

const errorHandler = require("./middleware/error-handler");

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/api/products", productsRoute);
app.use("/api/cart", cartRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/admin", adminRouter);
app.use("/api/categories", categoryRouter);

const frontendDistPath = path.join(__dirname, "dist", "frontend", "browser");
console.log("Frontend dist path:", frontendDistPath);
console.log("Frontend exists:", fs.existsSync(frontendDistPath));

app.use(
  express.static(frontendDistPath, {
    index: false,
  })
);

app.get("*", (req, res) => {
  const indexPath = path.join(frontendDistPath, "index.html");
  console.log("Serving index.html for:", req.path);

  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).send(`index.html not found at ${indexPath}`);
  }
});

app.use(errorHandler);

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
