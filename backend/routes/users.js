const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');

const User = require('../models/user');

// User handling


// Fetch single user
router.get('/:username', checkAuth, (req, res, next) => {
  User.findOne( { username: req.params.username })
  .then((user) => {
    res.status(201).json({
      message: 'User fetched successfully!',
      user: user
    });
  });
});

// Add/remove follower to user
router.put('/:id', checkAuth, (req, res, next) => {

  const followerId = req.userData.userId.toString();

  if (req.body.type === 'follow') {

    User.findOne( { _id: req.params.id })
    .then((targetUser) => {
      if (!targetUser.followers.includes(followerId)) {
        let newFollowers = targetUser.followers;
        newFollowers.push(followerId);
        return User.findByIdAndUpdate( { _id: targetUser._id }, { followers: newFollowers })
      }
    })
    .then((targetUser) => {
      res.status(201).json({ message: 'Follower added successfully from ' + followerId + ' to ' + targetUser._id })
    });

  }

  if (req.body.type === 'unfollow') {

    User.findOne( { _id: req.params.id })
    .then((targetUser) => {
      let newFollowers = targetUser.followers;
      let index = newFollowers.indexOf(followerId);
      if (index >= 0) {
        newFollowers.splice(index, 1);
        return User.findByIdAndUpdate( { _id: targetUser._id }, { followers: newFollowers })
      } else {
        res.status(201).json({ message: 'User was not following already!'})
      }
    })
    .then((targetUser) => {
      res.status(201).json({ message: 'Follower removed successfully' })
    });
  }

});

// Get users by search
router.post('/find', checkAuth, (req, res, next) => {
  let searchName = req.body.searchName;
  searchName = searchName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // Avoid allowing user to perform regexp search
  User.find({ username: { $regex: `${searchName}`, $options: "si" } })
  .then(users => {
    res.status(200).json({
      message: 'Users fetched successfully!',
      users: users
    });
  });
});

// Add new user
router.post('/add', (req, res, next) => {

  bcrypt.hash(req.body.password, 10)
  .then(hash => {
      const user = new User({
      username:  req.body.username,
      password: hash,
      followers: []
    });
    user.save().then(createdUser => {
      const token = jwt.sign(
        { username: createdUser.username, id: createdUser._id },
        'blogsapptokenlongstringrandomcomesnow0$!q1f4nwj4gd!#gd67&#jv6nc64e0&89klx#p!n041pdhu&4s%a3f4h#4c',
        { expiresIn: '1h' }
      );
      res.status(201).json({
        message: 'User added successfully',
        token: token,
        expireLength: 3600
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      })
    })
  });
});

router.post('', (req, res, next) => {

  let foundUser;

  // Login requests
  if (req.body.type === 'login') {
    const query  = User.where({ username: req.body.args.username });
    query.findOne()
    .then(document => {
      if (!document) {
        return res.status(401).json({
          message: 'User not found!'
        });
      }
      foundUser = document;
      return bcrypt.compare(req.body.args.password, document.password);
    })
    .then(result => {
      if (!result) {
        return res.status(401).json({
          message: 'Authentication failed! Password might be incorrect'
        });
      }
      const token = jwt.sign(
          { username: foundUser.username, id: foundUser._id },
          'blogsapptokenlongstringrandomcomesnow0$!q1f4nwj4gd!#gd67&#jv6nc64e0&89klx#p!n041pdhu&4s%a3f4h#4c',
          { expiresIn: '1h' }
        );
      res.status(200).json({
        token: token,
        expireLength: 3600
      });
    })
    .catch(error => {
      return res.status(401).json({
        message: 'Authorization failed - something is wrong. Error: ' + error
      });
    });
  }

  // Check username existence for frontend UI
  if (req.body.type === 'check') {

    const query  = User.where({ username: req.body.args.username});
    query.findOne().then(document => {
      res.status(200).json({
        user: document
      });
    });
  }

});

router.delete('/:id', (req, res, next) => {
  User.deleteOne({ _id: req.params.id})
    .then(() => {
      console.log('User with id ' + req.params.id + ' deleted!')
      res.status(200).json({message: 'User deleted!'});
    });
});

module.exports = router;
