const mongoose = require('mongoose');

const notificationSchema = mongoose.Schema({
  text: { type: String, required: true},
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  receiverId: { type: mongoose.Schema.Types.ObjectId, red: "User", required: true },
  type: { type: String, required: true },
  objectLinkId: { type: String, required: true },
  read: { type: Boolean, required: true },
  createDate: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Notification', notificationSchema);
