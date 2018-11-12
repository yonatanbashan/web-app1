const express = require('express');
const router = express.Router();

const checkAuth = require('../middleware/check-auth');

const Comment = require('../models/comment');

router.post('new', checkAuth, (req, res, next) => {

  const comment = new Comment({
    content: req.body.content,
    author: req.userData.userId,
    relatedPost: req.body.postId
  });
  comment.save().then(createdComment => {
    res.status(201).json({
      message: 'Comment added successfully',
      commentId: createdComment._id
    });
  });

});

router.get('/:postId', checkAuth, (req, res, next) => {

  Post.find({ relatedPost: req.params.postId })
  const comment = new Comment({
    content: req.body.content,
    author: req.userData.userId,
    relatedPost: req.body.postId
  });
  comment.save().then(createdComment => {
    res.status(201).json({
      message: 'Comment added successfully',
      commentId: createdComment._id
    });
  });

});



module.exports = router;
