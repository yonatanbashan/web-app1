const express = require('express');

const router = express.Router();
const checkAuth = require('../middleware/check-auth');

const User = require('../models/user');
const UserController = require('../controllers/users');
const uploadFile = require("../middleware/file");

// User handling

// POST requests


// Get users by search
router.post('/find', checkAuth, UserController.searchUsers);

// Add new user
router.post('/add', UserController.addUser);

// Login and check existence
router.post('', UserController.loginUser);


// GET requests

// Fetch single user
router.get('/get/name/:username', checkAuth, UserController.getUserByName);
router.get('/get/id/:id', checkAuth, UserController.getUserById);

// Retrieve user info
router.get('/info', checkAuth, UserController.getUserInfo);

// Get all users which the current user is following
router.get('/followed', checkAuth, UserController.getFollowedUsers);



// PUT requests

// Update user info
router.put('/info', checkAuth, uploadFile.single('image'), UserController.updateUserInfo);

// Add/remove follower to user
router.put('/:id', checkAuth, UserController.modifyFollow);



// DELETE requests

// Delete user
router.delete('/image', checkAuth, UserController.deleteUserProfileImage)

router.delete('/:id', checkAuth, UserController.deleteUser);



// ADMIN utilities
router.post('/admin', checkAuth, UserController.pingRequest);


module.exports = router;
