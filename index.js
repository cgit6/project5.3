// 有這個express 就不需要再引入body parser
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
// 把auth-route接進來
const authRoute = require("./routes/auth-route");

const profileRoute = require("./routes/profile-route");
// 為什麼不用加const變數?
require("./config/passport");
// const cookieSession = require("cookie-session");

const session = require("express-session");
const flash = require("connect-flash");

const passport = require("passport");
const port = process.env.POST || 8080;

// mongodb basic setting
mongoose
  // 轉到.env檔
  .connect(process.env.DB_CONNECT, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("connect to mongodb atlas");
  })
  .catch((err) => {
    console.log(err);
  });

// middleware
// middleware 的順序性
app.set("view engine", "ejs");
// what function in here?
app.use(express.json());
// app.use(bodyparser.urlencoded({extends: true}));
// express include bodyparser
app.use(express.urlencoded({ extended: true }));

// 先設定session
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

// 第二步設定passport
// 這兩個 middleware 的意思是?
app.use(passport.initialize());
app.use(passport.session());

// 最後才是flash
// flash
app.use(flash());
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  // passport 專用
  res.locals.error = req.flash("error");
  next();
});

// 最後才是route
// 當node.js接收到的任何request 會經過middleware 會去檢查有沒有 /auth
// 如果有就會進入authRoute去判斷
// 選擇要執行 /login 還是 /google

// 就是 auth/...後面再去接就是源自這裡
app.use("/auth", authRoute);
app.use("/profile", profileRoute);

// route
app.get("/", (req, res) => {
  res.render("index", { user: req.user });
});

app.listen(port, () => {
  console.log("serrver is runnong on port 8080");
});
