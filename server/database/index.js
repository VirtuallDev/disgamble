const MONGO_URI = process.env.MONGO_URI;

const mongoose = require('mongoose');
mongoose.connect(MONGO_URI);

const UserSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  salt: String,
  userId: String,
  userImage: String,
  status: String,
  bio: String,
  friends: Array,
  friendRequests: Array,
  blockedUsers: Array,
  communityList: Array,
  sessionToken: Object,
  dateOfBirth: Date,
});

exports.User = mongoose.model('User', UserSchema, 'users');
