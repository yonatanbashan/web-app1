const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();

const User = require('../models/user');

// User handling

router.post('/add', (req, res, next) => {

  bcrypt.hash(req.body.password, 10)
  .then(hash => {
      const user = new User({
      username:  req.body.username,
      password: hash
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
