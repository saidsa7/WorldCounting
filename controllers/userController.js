const { check, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const authUserText = require("../models/authUser");

// logout
const user_logout_get = (req, res) => {
  res.clearCookie("jwt");
  res.redirect("/login");
};

// home page :
const user_index_get = async (req, res) => {
  const texts = await authUserText.find();
  // console.log(texts);
  res.render("index");
};

// view text details :
const user_view_get = (req, res) => {
  res.render("user/view");
};

// welcome page :
const user_welcome_get = (req, res) => {
  res.render("welcome");
};

// login page :
const user_login_get = (req, res) => {
  res.render("auth/login.ejs");
};

// POST login page :
const user_login_post = async (req, res) => {
  try {
    const user = await authUserText.findOne({ email: req.body.email });
    // console.log("the req body is : ", req.body);
    // console.log("the user is : ", user);
    if (!user) {
      res.json({ emailNotFound: "Email not found" });
    } else {
      const match = await bcrypt.compare(req.body.password, user.password);
      if (match) {
        console.log("Email and Password are correct !");
        var token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY);
        res.cookie("jwt", token, { httpOnly: true, maxAge: 86400000 });
        // res.redirect("/home");
        res.json({ id: user._id });
      } else {
        res.json({ invalidPassword: " Wrong Password" });
      }
    }
  } catch (error) {
    console.log(error);
    res.send("Error during login. Please try again.");
  }
};

const user_signup_get = (req, res) => {
  res.render("auth/signup.ejs");
};

//  POST signup  page :
const user_signup_post = async (req, res) => {
  try {
    const objError = validationResult(req);
    console.log(objError.errors);
    if (objError.errors.length > 0) {
      // res.json({ errors: objError.errors });
      return res.json({ validationErrors: objError.errors });
    }
    const isEmail = await authUserText.findOne({ email: req.body.email });
    if (isEmail) {
      return res.json({ isExistingEmail: "the Email is already exist" });
      // res.redirect("/signup");
    }
    const user = await authUserText.create(req.body);
    // console.log(req.body);
    // console.log(user);
    var token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY);
    res.cookie("jwt", token, { httpOnly: true, maxAge: 86400000 });
    res.json({ id: user._id });
  } catch (error) {
    console.log(error);
    res.send("Error during signup. Please try again.");
  }
};

module.exports = {
  user_logout_get,
  user_index_get,
  user_view_get,
  user_welcome_get,
  user_login_get,
  user_login_post,
  user_signup_get,
  user_signup_post,
};
