const express = require('express');

const router = express.Router();
const checkAuth = require('../middleware/check-auth');

const User = require('../models/user');
const UserController = require('../controllers/users');
const extractFile = require("../middleware/file");

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
router.get('/get', checkAuth, UserController.getUser);

// Retrieve user info
router.get('/info', checkAuth, UserController.getUserInfo);

// Get all users which the current user is following
router.get('/followed', checkAuth, UserController.getFollowedUsers);



// PUT requests

// Update user info
router.put('/info', checkAuth, extractFile, UserController.updateUserInfo);

// Add/remove follower to user
router.put('/:id', checkAuth, UserController.modifyFollow);



// DELETE requests

// Delete user
router.delete('/:id', checkAuth, UserController.deleteUser);




// ADMIN utilities
router.post('/admin', checkAuth, UserController.pingRequest);


module.exports = router;
