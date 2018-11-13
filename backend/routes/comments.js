const express = require('express');
const router = express.Router();

const checkAuth = require('../middleware/check-auth');

const Comment = require('../models/comment');
const User = require('../models/user');
const Post = require('../models/post');

// Add a comment to post
router.post('', checkAuth, (req, res, next) => {

  let username;
  let followersOfPostAuthor;

  Post.findOne({ _id: req.body.postId })
  .then((post) => {
    return User.findOne( {_id: post.creator })
  })
  .then((postAuthor) => {
    followersOfPostAuthor = postAuthor.followers;
    //TODO: implement checks
    return
  })
  .then(() => {
    return User.findOne({ _id: req.userData.userId });
  })
  .then((user) => {
      username = user.username;
  })
  .then(() => {
      const comment = new Comment({
        content: req.body.content,
        creatorId: req.userData.userId,
        creatorName: username,
        postId: req.body.postId
      });
      comment.save().then(() => {
        res.status(201).json({ message: 'Comment added successfully!'});
      });
  });

});

// Get all comments of a specific post
router.get('/post/:id', checkAuth, (req, res, next) => {

  Comment.find({ postId: req.params.id }).then((comments) => {
    res.status(201).json({
      message: 'Comment added successfully!',
      comments: comments
    });
  });

});

// Delete a comment to post
router.delete('/:id', checkAuth, (req, res, next) => {
  Comment.deleteOne({ _id: req.params.id }).then((result) => {
    res.status(201).json({
      message: 'Comment deleted successfully!'
    });
  });

});


module.exports = router;
