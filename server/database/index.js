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
  serverList: Array,
  refreshToken: Object,
  dateOfBirth: Date,
});

const MessageSchema = new mongoose.Schema({
  username: String,
  userId: String,
  userImage: String,
  message: String,
  timestamp: Date,
});

const ServerSchema = new mongoose.Schema({
  servername: String,
  serverId: String,
  serverImage: String,
  serverAddress: String,
  usersOnline: Array,
  description: String,
  dateCreated: Date,
});

exports.User = mongoose.model('User', UserSchema, 'users');
exports.Message = mongoose.model('Message', MessageSchema, 'messages');
exports.Server = mongoose.model('Server', ServerSchema, 'servers');
