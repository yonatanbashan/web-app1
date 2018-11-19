const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
  username: { type: String, required: true, unique: true},
  password: { type: String, required: true},
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }],
  userInfo: {
    birthDate: { type: String, default: undefined },
    hideDate: { type: Boolean, default: false },
    headerText: { type: String, default: undefined },
    profileImagePath: { type: String, default: undefined },
  }
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);
