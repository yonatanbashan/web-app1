const express = require('express');
const router = express.Router();

const checkAuth = require('../middleware/check-auth');
const tokenDecode = require('../common/token-decode');

const Post = require('../models/post');
const User = require('../models/user');

// Add new post
router.post('/new', checkAuth, (req, res, next) => {
  const post = new Post({
    title:  req.body.title,
    content: req.body.content,
    creator: req.userData.userId
  });
  post.save().then(createdPost => {
    res.status(201).json({
      message: 'Post added successfully',
      postId: createdPost._id
    });
  });

});

// Retrieve all posts by specified user
router.get('/user/:username', checkAuth, (req, res, next) => {

  // Search the user's ID, and then search posts by this ID
  User.findOne({ username: req.params.username })
  .then((user) => {
    Post.where({ creator: user._id })
    .then(documents => {
      res.status(200).json(
        {
          message: 'Posts by user ' + req.params.username + ' fetched successfully!',
          posts: documents
        }
      );
    });
  })
  .catch(() => {
    res.status(404).json(
      {
        message: 'User not found!',
      }
    );
  });

});

// Retrieve all posts by current user
router.post('', checkAuth, (req, res, next) => {

  Post.find({ creator: req.userData.userId })
  .then(documents => {
    res.status(200).json(
      {
        message: 'Posts fetched successfully!',
        posts: documents
      }
    );
  });

});

router.delete('/:id', checkAuth, (req, res, next) => {
  Post.deleteOne({ _id: req.params.id})
    .then(() => {
      res.status(200).json({message: 'Post deleted!'});
    });

});


module.exports = router;
