const express = require("express");
const router = express.Router();
const config = require("../config/config");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { isUserLoggedIn } = require("../middleware/userhandler");
const userModel = require("../models/user");
const flash = require("connect-flash");
const orderModel = require('../models/order')

router.get("/", isUserLoggedIn, async (req, res) => {
  // console.log(req.user)
  const message = req.flash("message")
  let user = await userModel.findOne({ _id: req.user.userid });
  res.render("profile", { user , message});
});

router.get("/edit", isUserLoggedIn, async (req, res) => {
  let user = await userModel.findOne({ _id: req.user.userid });
  res.render("edit", { user });
});

router.post("/update", isUserLoggedIn, async (req, res) => {
  let { name, password, contact } = req.body;
  let user = await userModel.findOne({ _id: req.user.userid });
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user.fullname = name;
    user.password = hashedPassword;
    user.contact = contact;

    await user.save();
    console.log("Details Updated!");
    req.flash("message", "Details has been updated");

    res.redirect("/profile");
  } 
    catch (error) {
        console.error(error);
        req.flash("error", "Internal Error");
        res.status(500).send("Internal Error");
  }
});

module.exports = router;
