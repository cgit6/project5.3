const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  // project
  project: {
    type: String,
    required: false,
  },
  content: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },

  date: {
    type: Date,
    default: Date.now,
  },
  author: String,
});

module.exports = mongoose.model("Post", postSchema);
