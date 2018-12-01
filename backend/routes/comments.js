const express = require('express');
const router = express.Router();

const checkAuth = require('../middleware/check-auth');
const CommentController = require("../controllers/comments");

// Add a comment to post
router.post('/new', checkAuth, CommentController.addComment);

// Get all comments of a specific post
router.get('/post/:id', checkAuth, CommentController.getPostComments);

// Delete a comment to post
router.delete('/:id', checkAuth, CommentController.deleteComment);


module.exports = router;
