const express = require("express");
const router = express.Router();

const { check, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const authUserText = require("../models/authUser");

const { checkIfUser, requireAuth } = require("../middleware/middleware");
const userController = require("../controllers/userController");
// logout :
router.get("/logout", userController.user_logout_get);
// home page :
router.get("/home", requireAuth, userController.user_index_get);

// view text details :
router.get("/view", requireAuth, userController.user_view_get);

// welcome page :
router.get("/", userController.user_welcome_get);
// login page :
router.get("/login", userController.user_login_get);

// POST login page :
router.post("/login", userController.user_login_post);

// GET signup  page :
router.get("/signup", userController.user_signup_get);
//  POST signup  page :
router.post(
  "/signup",
  [
    check("email", "Please provide a valid email").isEmail(),
    check(
      "password",
      "Password must be at least 8 characters with 1 upper case letter and 1 number"
    ).matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/),
  ],
  userController.user_signup_post
);
// add text
router.post("/home", (req, res) => {
  res.render("index.ejs");
});

module.exports = router;
