const fs = require('fs');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const appConfig = require('../common/app-config');

exports.getFollowedUsers = (req, res, next) => {
  User.find( { followers: {$in: [req.userData.userId]} })
  .then(users => {
    res.status(200).json({
      message: 'Followed users fetched successfully!',
      users: users
    });
  });
};

exports.searchUsers = (req, res, next) => {
  let searchName = req.body.searchName;
  searchName = searchName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // Avoid allowing user to perform regexp search
  User.find({ username: { $regex: `${searchName}`, $options: "si" } })
  .then(users => {
    res.status(200).json({
      message: 'Users fetched successfully!',
      users: users
    });
  });
};

exports.getUserInfo = (req, res, next) => {


  User.findOne({ username: req.query.username })
  .then(response => {
    res.status(200).json({
      message: 'User info for username "' + req.body.username + '" was sent back successfully!',
      userInfo: response.userInfo
    })
  })
  .catch(() => {
    res.status(404).json({
      message: 'User wasn\'t found!'
    });
  });
};

exports.addUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
  .then(hash => {
      const user = new User({
      username:  req.body.username,
      password: hash,
      followers: [],
      userInfo: {}
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
};

exports.loginUser = (req, res, next) => {
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
};

exports.getUserByName = (req, res, next) => {
  User.findOne( { username: req.params.username })
  .then((user) => {
    res.status(201).json({
      message: 'User fetched successfully!',
      user: user
    });
  });

};

exports.getUserById = (req, res, next) => {
  User.findById(req.params.id)
  .then((user) => {
    res.status(201).json({
      message: 'User fetched successfully!',
      user: user
    });
  });

};

exports.updateUserInfo = (req, res, next) => {
  const url = appConfig.AWSAddress;
  let userInfo = req.body;
  if(req.file !== undefined) {
    userInfo.image = undefined;
    userInfo.profileImagePath = url + '/' + req.file.key;
  }
  User.findByIdAndUpdate(req.userData.userId, { userInfo: userInfo } )
  .then(response => {
    res.status(200).json({
      message: 'User info updated successfully!'
    });
  })
};

exports.modifyFollow = (req, res, next) => {

  const followerId = req.userData.userId.toString();

  if (req.body.type === 'follow') {

    User.findById(req.params.id)
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

    User.findByIdAndUpdate(req.params.id, { $pull: { followers: followerId } })
    .then((targetUser) => {
      res.status(201).json({ message: 'Follower removed successfully' })
    });
  }

};

exports.deleteUser = (req, res, next) => {
  User.deleteOne({ _id: req.params.id})
    .then(() => {
      console.log('User with id ' + req.params.id + ' deleted!')
      res.status(200).json({message: 'User deleted!'});
    });
};

exports.deleteUserProfileImage = (req, res, next) => {
  User.findById(req.userData.userId)
  .then(user => {
    let userInfo = user.userInfo;
    if(userInfo.profileImagePath) {
      userInfo.profileImagePath = undefined;
    }
    return userInfo;
  })
  .then(userInfo => {
    return User.findByIdAndUpdate(req.userData.userId, { userInfo: userInfo })
  })
  .then(() => {
    res.status(201).json({
      message: 'Photo deleted successfully!'
    });
  });
};



// Admin utilities

exports.pingRequest = (req, res, next) => {
  res.status(201).json({
    message: 'Ping successful!',
    request: req.body
  })
};
