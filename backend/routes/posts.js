const express = require('express');
const router = express.Router();

const checkAuth = require('../middleware/check-auth');

const PostController = require('../controllers/posts');


// POST Requests

// Add new post
router.post('/new', checkAuth, PostController.addPost);





// GET Requests

// Retrieve all posts by specified username
router.get('/user/:username', checkAuth, PostController.getPostsByUsername);

// Get single post
router.get('/id/:id', checkAuth, PostController.getPostById);

// Retrieve all posts by current user (by ID)
router.get('/all', checkAuth, PostController.getMyPosts);

// Get feed posts
router.get('/feed', checkAuth, PostController.getFeedPosts);



// DELETE Requests

// Delete post
router.delete('/:id', checkAuth, PostController.deletePost);


module.exports = router;
