const express = require("express");
const bodyParser = require('body-parser');

const mongoose = require("mongoose");

const app = express();

const dotenv = require("dotenv");
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

const cors = require("cors");

const errorHandler = require("./middleware/error-handler");

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(errorHandler);

const productsRoute = require("./routes/products.routes");
app.use("/products", productsRoute);

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
