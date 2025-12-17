const express = require("express");
const mongoose = require("mongoose");
const app = express();
const authUserText = require("./models/authUser");
const port = 3000;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
var cookieParser = require("cookie-parser");
require("dotenv").config();
app.use(express.json());

const allRoutes = require("./routes/allRoutes");
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

const { check } = require("express-validator");
// import middleware
const { checkIfUser, requireAuth } = require("./middleware/middleware");

app.use(checkIfUser);

//  livereload :

app.use(express.static("public"));

const path = require("path");
const livereload = require("livereload");
const connectLivereload = require("connect-livereload");
const { validationResult } = require("express-validator");
const liveReloadServer = livereload.createServer();
liveReloadServer.watch(path.join(__dirname, "public"));
liveReloadServer.server.once("connection", () => {
  setTimeout(() => {
    liveReloadServer.refresh("/");
  }, 100);
});
app.use(connectLivereload());

// === livereload

// app.use(express.json());
app.set("view engine", "ejs");

console.log("starting server...");
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    app.listen(port, () => {
      console.log(
        `Example app listening on port ${port} the link is http://localhost:${port}/ `
      );
    });
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

// mongodb+srv://bou3sa:XB1l4zga6XPZXPs8@cluster0.2jyk2fo.mongodb.net/counting-text-word?appName=Cluster0

app.use(allRoutes);
