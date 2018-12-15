const Post = require('../models/post');
const User = require('../models/user');
const Comment = require('../models/comment');

exports.addPost = (req, res, next) => {
  const post = new Post({
    title:  req.body.title,
    content: req.body.content,
    creator: req.userData.userId,
    comments: []
  });
  console.log(req.body);
  post.save().then(createdPost => {
    res.status(201).json({
      message: 'Post added successfully',
      postId: createdPost._id
    });
  });
};


exports.getMyPosts = (req, res, next) => {
  Post.find({ creator: req.userData.userId })
  .then(documents => {
    res.status(200).json(
      {
        message: 'Posts fetched successfully!',
        posts: documents
      }
    );
  });
};


exports.getPostById = (req, res, next) => {
  Post.findById(req.params.id)
  .then(post => {
    res.status(200).json({
      message: 'Post fetched successfully!',
      post: post
    });
  });
}

exports.getPostsByUsername = (req, res, next) => {
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
};

exports.getFeedPosts = (req, res, next) => {
  let followedIds = [];
  User.find( { followers: {$in: [req.userData.userId]} })
  .then(users => {
    users.forEach(user => {
      followedIds.push(user._id);
    });
    return;
  })
  .then(() =>{
    return Post.find( {creator: { $in: followedIds} });
  })
  .then(posts => {
    posts.sort((a,b) => {
      return new Date(b.createDate) - new Date(a.createDate);
    });
    const amount = +req.query.amount;

    let offset;
    if(req.query.offset !== undefined) {
      offset = +req.query.offset;
    } else {
      offset = 0;
    }

    if( (amount + offset + 1) >= posts.length) {
      posts = posts.slice(offset);
    } else {
      posts = posts.slice(offset, amount);
    }

    res.status(200).json({
      message: 'Followed posts fetched successfully',
      minPost: offset,
      maxPost: offset + amount - 1,
      posts: posts
    });
  })
};


exports.deletePost = (req, res, next) => {
  //console.log(req.body);
  Comment.deleteMany( { postId: req.params.id })
  .then(() => {
    return Post.deleteOne({ _id: req.params.id });
  })
  .then(() => {
      res.status(200).json({message: 'Post deleted!'});
  });
};
