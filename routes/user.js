const express = require('express');
const { model } = require('mongoose');
const { route } = require('./listing');
const router = express.Router();
const wrapasync=require("../utils/wrapasync");
const passport = require('passport');
const {saveredirectUrl}=require("../middleware.js");
const userController=require("../controllers/user.js")

//show signup form //singup route
router.route("/signup")
.get(userController.rendersignupform)
.post( wrapasync(userController.signup))

//render login form //login route
router.route("/login")
.get(userController.renderloginform)
.post(saveredirectUrl,
     passport.authenticate("local",{
    failureRedirect:"/login",
     failureFlash:true
    }),
    userController.login
)

router.get("/logout",userController.logout)

module.exports=router;