const express = require('express');
const router = express.Router();

const checkAuth = require('../middleware/check-auth');
const tokenDecode = require('../common/token-decode');

const Post = require('../models/post');

// Add new post
router.post('new', checkAuth, (req, res, next) => {

  const post = new Post({
    title:  req.body.title,
    content: req.body.content,
    userId: req.userData.userId
  });
  post.save().then(createdPost => {
    res.status(201).json({
      message: 'Post added successfully',
      postId: createdPost._id
    });
  });

});

// Retrieve all posts by user
router.post('', checkAuth, (req, res, next) => {

  Post.find({ userId: req.userData.userId })
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
      console.log('Post with id ' + req.params.id + ' deleted!')
    });
  res.status(200).json({message: 'Post deleted!'});
});


module.exports = router;
