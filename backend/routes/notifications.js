const express = require('express');
const router = express.Router();

const checkAuth = require('../middleware/check-auth');
const NotificationController = require("../controllers/notifications");

// Add a notification to post
router.post('/add', checkAuth, NotificationController.addNotification);

// Get all notifications
router.get('/all', checkAuth, NotificationController.getNotifications);

// Mark as read
router.get('/mark', checkAuth, NotificationController.markAllAsRead);

// Clear all notifications
router.get('/clear', checkAuth, NotificationController.clearAll);

module.exports = router;
