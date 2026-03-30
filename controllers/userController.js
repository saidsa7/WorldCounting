const { check, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const AuthUser = require("../models/authUser");
const Text = require("../models/texts");

// logout
const user_logout_get = (req, res) => {
  res.clearCookie("jwt");
  res.redirect("/login");
};

// home page :
const user_index_get = async (req, res) => {
  const decoded = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET_KEY);
  const texts = await Text.find({ user: decoded.id });

  res.render("index", { textsArr: texts });
};

// view text details :
const user_view_get = (req, res) => {
  res.render("user/view");
};

// welcome page :
const user_welcome_get = (req, res) => {
  try {
    jwt.verify(req.cookies.jwt, process.env.JWT_SECRET_KEY);
    res.redirect("/home");
  } catch (err) {
    return res.redirect("/login");
  }
};

// login page :
const user_login_get = (req, res) => {
  res.render("auth/login.ejs");
};

// POST login page :
const user_login_post = async (req, res) => {
  try {
    const user = await AuthUser.findOne({ email: req.body.email });
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
    const isEmail = await AuthUser.findOne({ email: req.body.email });
    if (isEmail) {
      return res.json({ isExistingEmail: "the Email is already exist" });
      // res.redirect("/signup");
    }
    const user = await AuthUser.create(req.body);
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

// add text
const user_index_post = async (req, res) => {
  let decoded = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET_KEY);
  try {
    // 1- create text in the Text collection
    const newText = await Text.create({
      title: req.body.title,
      text: req.body.text,
      wordsTotal: req.body.wordsTotal,
      withoutRepetition: req.body.withoutRepetition,
      user: decoded.id,
    });
    // 2- add the text id to the user
    await AuthUser.updateOne(
      { _id: decoded.id },
      { $push: { texts: newText._id } },
    );
    res.redirect("/home");
  } catch {
    error;
  }
  {
    res.json({ error: "Error during adding text. Please try again." });
  }
};

// delete text
const user_delete_text = async (req, res) => {
  const decoded = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET_KEY);
  try {
    await Text.findByIdAndDelete(req.params.id);
    await AuthUser.updateOne(
      { _id: decoded.id },
      { $pull: { texts: req.params.id } },
    );
    res.redirect("/home");
  } catch (error) {
    res.json({ error: "Error during deleting text. Please try again." });
  }
};

// edit text get (show text details in the edit page)
const user_edit_get = async (req, res) => {
  const decoded = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET_KEY);
  try {
    const textToEdit = await Text.findById(req.params.id);
    res.render("edit", { text: textToEdit });
  } catch (error) {
    res.json({ error: "Error during editing text. Please try again." });
  }
};

// edit text put
const user_edit_put = async (req, res) => {
  const decoded = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET_KEY);
  try {
    await Text.findByIdAndUpdate(req.params.id, {
      title: req.body.title,
      text: req.body.text,
    });

    res.redirect("/home");
  } catch (error) {
    res.json({ error: "Error during updating text. Please try again." });
  }
};

// search texts
const user_search_post = async (req, res) => {
  try {
    const decoded = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET_KEY);
    const texts = await Text.find({ user: decoded.id });

    const escapeRegex = (string) =>
      string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const searchTerm = req.body.searchTerm;

    const regex = new RegExp(escapeRegex(searchTerm), "gi");
    if (!searchTerm) {
      return res.render("search", {
        textsArr: [],
        regex: "",
        searchTerm: "",
      });
    }

    const filteredTexts = texts.filter(
      (text) => regex.test(text.text) || regex.test(text.title),
    );

    res.render("search", {
      textsArr: filteredTexts,
      regex,
      searchTerm,
    });
  } catch (error) {
    res.json({ error: "Error during searching texts. Please try again." });
  }
};

//  test get endpoint
const user_test_get = async (req, res) => {
  const decoded = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET_KEY);
  const user = await AuthUser.findOne({ _id: decoded.id });
  const searchTerm = "das";
  const filteredArr = user.texts.filter((el) => {
    return el.text.includes(searchTerm) || el.title.includes(searchTerm);
  });

  res.render("test", { filteredArr, searchTerm });
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
  user_index_post,
  user_delete_text,
  user_edit_get,
  user_edit_put,
  user_search_post,
  user_test_get,
};
