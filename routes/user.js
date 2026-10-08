const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const Wrap = require("../utils/wrapAsync.js");
const passport = require("passport");
const {saveRedirecturl} = require("../middleware.js");
const userController = require("../controller/user.js");

router.route("/signup")
.get(userController.renderSignup)
.post(Wrap(userController.signup));

router.route("/login")
.get((req, res) => {
    res.render("users/login.ejs");
})
.post(
    saveRedirecturl,
    passport.authenticate("local", {
        failureRedirect: "/login",
        failureFlash: true
    }),
    userController.login
);

// Logout
router.get("/logout", userController.logout);

module.exports = router;