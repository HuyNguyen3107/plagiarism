var createError = require("http-errors");
require("dotenv").config();
var express = require("express");
var path = require("path");
var logger = require("morgan");
const cors = require("cors");

const indexRouter = require("./routes/index");

// var corsOptions = {
//   origin: function (origin, callback) {
//     const env = process.env.NODE_ENV || "development";
//     callback(null, true);
//   },
// };

var app = express();
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use(cors({ origin: "*" })); // Allow all origins for development
app.use("/uploads", express.static("uploads"));
app.use("/", indexRouter);

module.exports = app;
