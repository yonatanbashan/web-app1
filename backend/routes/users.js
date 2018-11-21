const express = require('express');

const router = express.Router();
const checkAuth = require('../middleware/check-auth');

const User = require('../models/user');
const UserController = require('../controllers/users');


// User handling

// POST requests

// Get all users which the current user is following
router.post('/followed', checkAuth, UserController.getFollowedUsers);

// Get users by search
router.post('/find', checkAuth, UserController.searchUsers);

// Retrieve user info
router.post('/info', checkAuth, UserController.getUserInfo);

// Add new user
router.post('/add', UserController.addUser);

// Login and check existence
router.post('', UserController.loginUser);



// GET requests

// Fetch single user
router.get('/:username', checkAuth, UserController.getUser);



// PUT requests

// Update user info
router.put('/info', checkAuth, UserController.updateUserInfo);

// Add/remove follower to user
router.put('/:id', checkAuth, UserController.modifyFollow);



// DELETE requests

router.delete('/:id', checkAuth, UserController.deleteUser);

module.exports = router;
