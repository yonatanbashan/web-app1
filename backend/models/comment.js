const mongoose = require('mongoose');

const commentSchema = mongoose.Schema({
  content: { type: String, required: true},
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  relatedPost: { type: mongoose.Schema.Types.ObjectId, red: "Post", required: true }
});

module.exports = mongoose.model('Comment', postSchema);
