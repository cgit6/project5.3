const router = require("express").Router();
const Post = require("../models/post-model");

const authCheck = (req,res,next) =>{
  console.log(req.originalUrl);
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    res.redirect("/auth/login");
  } else {
    next();
  }
};

router.get("/", authCheck, async (req,res) => {
  let postFound = await Post.find({author: req.user._id});
  res.render("profile" , {user:req.user , posts:postFound});
});

// post page
router.get("/post" , authCheck, (req,res) => {
  res.render("post" , {user: req.user});
});

router.post("/post", authCheck, async(req,res) => {
  let {title, content} =req.body;
  let newPost = new Post({title, content , author: req.user._id }); 
try {
  await newPost.save();
  res.status(200).redirect("/profile");

} catch (err) {
  req.flash("error_msg" , "both title and content are required");
  res.redirect("/profile/post");

}
});

module.exports = router;