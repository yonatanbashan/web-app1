const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
  title: { type: String, required: true},
  content: { type: String, required: true},
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  createDate: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Post', postSchema);
