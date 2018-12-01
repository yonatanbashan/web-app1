const express = require('express');
const router = express.Router();

const checkAuth = require('../middleware/check-auth');

const PostController = require('../controllers/posts');

// Add new post
router.post('/new', checkAuth, PostController.addPost);

// Retrieve all posts by specified user
router.get('/user/:username', checkAuth, PostController.getUserPosts);

// Retrieve all posts by current user
router.post('', checkAuth, PostController.getMyPosts);

// Get feed posts
router.post('/feed', checkAuth, PostController.getFeedPosts);

// Delete post
router.delete('/:id', checkAuth, PostController.deletePost);


module.exports = router;
