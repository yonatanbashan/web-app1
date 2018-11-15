const mongoose = require('mongoose');

const commentSchema = mongoose.Schema({
  content: { type: String, required: true},
  creatorName: {type: String, required: true},
  creatorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  postId: { type: mongoose.Schema.Types.ObjectId, red: "Post", required: true },
  createDate: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Comment', commentSchema);
