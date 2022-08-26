// 本地註冊 的schema部分
const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 255,
  },
  googleID: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  thumbnail: {
    type: String,
  },
  // local login
  email: {
    type: String,
  },
  password: {
    type: String,
    minlength:8,
    // 因為還要hash password 所以會增加長度
    maxlength: 1024,
  },
});

module.exports = mongoose.model("User", userSchema);
