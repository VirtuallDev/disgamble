const mongoose = require('mongoose');
const MONGO_URI = process.env.MONGO_URI;

// Connect to the database
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to the database');
  })
  .catch((error) => {
    console.error('Error connecting to the database:', error);
  });

const userSchema = new mongoose.Schema({
  userInfo: {
    username: String,
    userId: String,
    image: String,
    status: String,
    userStatus: String,
    about: String,
    dateOfBirth: Date,
    creationDate: Date,
  },
  userAuth: {
    email: String,
    salt: String,
    password: String,
    refreshToken: { refreshToken: String, issued: Date },
  },
  voiceSettings: {
    inputMode: String,
    volume: String,
    key: String,
  },
  friends: {
    requests: Array,
    friends: Array,
    blocked: Array,
  },
});

exports.User = mongoose.model('User', userSchema, 'users');

const DmHistorySchema = new mongoose.Schema({
  author: {
    userId: String,
    username: String,
    image: String,
  },
  recipient: {
    userId: String,
    username: String,
    image: String,
  },
  message: {
    message: String,
    id: String,
    sentAt: Date,
    isEdited: Boolean,
  },
  recipients: [String],
});

exports.Dm = mongoose.model('DmHistory', DmHistorySchema, 'dmhistory');

const CallSchema = new mongoose.Schema({
  author: {
    userId: String,
    username: String,
    image: String,
  },
  recipient: {
    userId: String,
    username: String,
    image: String,
  },
  callId: String,
  offer: Object,
  answer: Object,
  isConnected: Boolean,
});

exports.Calls = mongoose.model('Calls', CallSchema, 'calls');

const ServerSchema = new mongoose.Schema({
  author: {
    userId: String,
    username: String,
    image: String,
  },
  server: {
    name: String,
    image: String,
    description: String,
    dateCreated: Date,
    usersOnline: Array,
    id: Number,
    channels: [Object],
  },
});

exports.Server = mongoose.model('Server', ServerSchema, 'servers');
