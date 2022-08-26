// 這個passport.js 檔案是做什麼的?
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20");
const User = require("../models/user-model");
const LocalStrategy = require("passport-local");
const bcrypt =require("bcrypt");

// req.user
// req.logout
// req.isAuthenticated()


passport.serializeUser((user, done) =>{
  // console.log("Serializing user now");
  done(null,user._id);
});
// cookies 會跟著req 送到server來
// server 需要去deserializeUser
passport.deserializeUser(( _id,done) => {
  // console.log("deserializeUser now");
  User.findById({_id}).then((user) =>{
    console.log("found user");
    done(null, user);
  });
});
// 本地端登入驗證
passport.use(
  new LocalStrategy(
    (username,password,done) => {
      // console.log(username,password);
      User.findOne({email: username}).then(
        async user => {
        // 如果使用者不存在
        if(!user) {
          return done(null,false);
        }
        // 如果使用者存在
        await bcrypt.compare(password,user.password ,function(err,result) {
          if (err) {
            return done(null,false);
          }
          if (!result) {
            return done(null,false);
          } else {
            return done(null,user);
          }
        });
      })
      .catch((err) => {
        return done(null,false);
      })
    }
  )

)

// 用於google api登入該系統
passport.use(
  new GoogleStrategy(
    {
    // 送到 .env 去
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/redirect",
    
    }, 
  // passport callback
  (accessToken, refreshToken, profile, done) => {
    console.log(profile);
    User.findOne({googleID:profile.id}).then((foundUser) => {
      // 如果資料庫裏面有這筆資料就是true會回傳"User already exist"
      if(foundUser) {
      
        console.log("User already exist");
        done(null, foundUser);

      }
      // 如果數據庫裏面沒有這筆資料就自己創造這筆資料並放進mongoDB裡面
      // new... 一個obj
      // save().then() Syntax
      else {
        // 建立
        new User({
          name: profile.displayName,
          googleID: profile.id,
          thumbnail: profile.photos[0].value,
          email:profile.emails[0].value,

        })
        // 儲存
        .save()
        .then((newUser) => {
          console.log("New user created.");
          done(null, newUser);
        });
      }
    })
  })
  );

  module.exports = passport;
