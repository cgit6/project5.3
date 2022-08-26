const router = require("express").Router();
const passport = require("passport");
const bcrypt = require("bcrypt");
const User = require("../models/user-model");

// 登入
router.get("/login", (req, res) => {
  res.render("login", { user: req.user });
});

// 本地註冊
router.get("/signup", (req, res) => {
  res.render("signup", { user: req.user });
});

// 登出
router.get("/logout", (req, res) => {
  req.logOut();
  res.redirect("/");
});

router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/auth/login",
    failureFlash: "wrong email or password",
  }),
  (req, res) => {
    if (req.session.returnTo) {
      let newPath = req.session.returnTo;
      req.session.returnTo = "";
      res.redirect(newPath); // profile/path
    } else {
      res.redirect("/profile");
    }
  }
);

router.post("/signup", async (req, res) => {
  console.log(req.body);
  // res.send("Thank for posting.")
  let { name, email, password } = req.body;
  // check if the data is already in db
  const emailExist = await User.findOne({ email });
  if (emailExist) {
    req.flash("error_msg", "Email has already been registered");
    // redirect means?
    res.redirect("/auth/signup");
  }

  // 加密
  const hash = await bcrypt.hash(password, 10);
  password = hash;
  let newUser = new User({ name, email, password });
  try {
    await newUser.save();
    req.flash("success_msg", "Registration succeeds. you can login now.");
    res.redirect("/auth/login");
  } catch (err) {
    req.flash("error_msg", err.errors.name.properties.message);
    res.redirect("/auth/signup");
  }
});

// 處理跟google authentication 有關的東西
router.get(
  "/google",
  // 要用passport 對google 做驗證
  passport.authenticate("google", {
    // 什麼是 scope
    // 什麼是 profile? 就是使用者在google的全部資料
    // 什麼是 email 就是使用者在google的email資料

    // 從google 驗證了使用者之後，server 想獲得使用者在google的資料
    scope: ["profile", "email"],
    prompt: "select_account",
  })
);

router.get("/google/redirect", passport.authenticate("google"), (req, res) => {
  if (req.session.returnTo) {
    let newPath = req.session.returnTo;
    req.session.returnTo = "";
    res.redirect(newPath);
  } else {
    res.redirect("/profile");
  }
});

module.exports = router;
