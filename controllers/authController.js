const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { validationResult } = require("express-validator");
const errorFormatter = require("../utils/validationErrorFormatter");

exports.singupGetController = (req, res, next) => {
  res.render("pages/auth/singup", {
    title: "Create A New Account",
    error: {},
    value: {},
  });
};
exports.singupPostController = async (req, res, next) => {
  let { username, password, email, confirmPassword } = req.body;

  let errors = await validationResult(req).formatWith(errorFormatter);
  if (!errors.isEmpty()) {
    return res.render("pages/auth/singup", {
      title: "Create A New Account",
      error: errors.mapped(),
      value: {
        username,
        password,
        email,
      },
    });
  }

  try {
    let hasedPassword = await bcrypt.hash(password, 11);
    let user = new User({
      username,
      email,
      password: hasedPassword,
    });
    let createdUser = await user.save();
    console.log("User created sucecfully", createdUser);
    res.render("pages/auth/singup", {
      title: "Create A New Account",
      error: {},
      value: {},
    });
  } catch (e) {
    console.log(e);
    next(e);
  }
};

exports.loginGetController = (req, res, next) => {
  console.log(req.session.isLoggedIn,req.session.user);

  res.render("pages/auth/login", {
    title: "Login To Your Account",
    error: {},
  });
};
exports.loginPostController = async (req, res, next) => {
   let { email, password } = req.body;

   let errors = validationResult(req).formatWith(errorFormatter);
   if (!errors.isEmpty()) {
     return res.render("pages/auth/login", {
       title: "Login to Your Account",
       error: errors.mapped(),
     });
   }

   try {
     let user = await User.findOne({ email });
     if (!user) {
       return res.json({
         message: "Email is invalid",
       });
     }

     let match = await bcrypt.compare(password, user.password);
     if (!match) {
       return res.json({
         message: "Password is invalid",
       });
     }
     req.session.isLoggedIn = true;
     req.session.user = user;
     req.session.save((err) => {
       if (err) {
         console.log(err);
         return next(err);
       }
       res.redirect("/dashboard");
     });
   } catch (e) {
     console.log(e);
     next(e);
   }
};

exports.logoutController = (req, res, next) => {
  req.session.destroy(err => {
    if (err) {
      console.log(err);
      return next(err);
    }
    return res.redirect("/auth/login")
  });
};
