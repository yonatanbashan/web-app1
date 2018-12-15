const Notification = require("../models/notification");
const User = require("../models/user");

// const notificationSchema = mongoose.Schema({
//   text: { type: String, required: true},
//   senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//   receiverId: { type: mongoose.Schema.Types.ObjectId, red: "User", required: true },
//   type: { type: String, required: true },
//   objectLinkId: { type: String, required: true },
//   read: { type: Boolean, required: true }
// });

exports.addNotification = (req, res, next) => {
  const notification = new Notification({
    text: req.body.text,
    senderId: req.userData.userId,
    receiverId: req.body.receiverId,
    type: req.body.type,
    objectLinkId: req.body.objectLinkId,
    read: false
  });
  notification.save().then(() => {
    res.status(201).json({ message: 'Notification added successfully!'});
  });
};

// Get all the user's notifications
exports.getNotifications = (req, res, next) => {
  Notification.find({receiverId: req.userData.userId})
  .then(notifications => {
    notifications.sort((a,b) => {
      return new Date(b.createDate) - new Date(a.createDate);
    });
    res.status(201).json({
      message: 'Notifications fetched successfully!',
      notifications: notifications
    });
  });

}

exports.markAllAsRead = (req, res, next) => {
  Notification.updateMany({receiverId: req.userData.userId, read: false}, { read: true })
  .then(() => {
    res.status(201).json({
      message: 'Notifications marked as read successfully!'
    });
  });
}


exports.clearAll = (req, res, next) => {
  Notification.deleteMany({receiverId: req.userData.userId})
  .then(() => {
    res.status(201).json({
      message: 'Notifications cleared successfully!'
    });
  });
}
