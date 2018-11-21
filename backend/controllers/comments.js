const Post = require("../models/post");
const Comment = require("../models/comment");
const User = require("../models/user");

exports.addComment = (req, res, next) => {

  let username;
  let followersOfPostAuthor;

  Post.findById(req.body.postId)
  .then((post) => {
    return User.findById(post.creator)
  })
  .then((postAuthor) => {
    followersOfPostAuthor = postAuthor.followers;
    //TODO: implement checks
    return
  })
  .then(() => {
    return User.findById(req.userData.userId);
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
};


exports.getPostComments = (req, res, next) => {

  Comment.find({ postId: req.params.id }).then((comments) => {
    res.status(201).json({
      message: 'Comment added successfully!',
      comments: comments
    });
  });

};

exports.deleteComment = (req, res, next) => {
  Comment.deleteOne({ _id: req.params.id }).then((result) => {
    res.status(201).json({
      message: 'Comment deleted successfully!'
    });
  });

};
