const express = require("express");
const router = require("express").Router();
const Post = require("../models/post-model");
const path = require("path");
const multer = require("multer");
const fs = require("fs");

// image upload
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
  },
});

// image
let uploads = multer({
  storage: storage,
}).single("image");

const authCheck = (req, res, next) => {
  console.log(req.originalUrl);
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    res.redirect("/auth/login");
  } else {
    next();
  }
};

router.get("/", authCheck, async (req, res) => {
  let postFound = await Post.find({ author: req.user._id });
  res.render("profile", { user: req.user, posts: postFound });
});

// post page
router.get("/post", authCheck, (req, res) => {
  res.render("post", { user: req.user });
});

router.post("/post", authCheck, async (req, res) => {
  let { title, project, content, image } = req.body;
  let newPost = new Post({
    title,
    project,
    content,
    image,
    author: req.user._id,
  });
  console.log(project);

  try {
    await newPost.save();
    res.status(200).redirect("/profile");
  } catch (err) {
    req.flash("error_msg", " title and content are required");
    res.redirect("/profile/post");
  }
});

// update
router.get("/update/:id", (req, res) => {});

router.post("/update/:id", (req, res) => {
  let id = req.params.id;
  let new_image = " ";
});

// delete
router.delete("/delete", authCheck, async (req, res) => {});

module.exports = router;
