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

const refreshTokenSchema = new mongoose.Schema({
  refreshToken: String,
  issued: Date,
});

const userSchema = new mongoose.Schema({
  userInfo: {
    username: String,
    userId: String,
    image: String,
    status: String,
    about: String,
    dateOfBirth: Date,
  },
  userAuth: {
    email: String,
    salt: String,
    password: String,
    refreshToken: refreshTokenSchema,
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
  servername: String,
  serverId: String,
  serverImage: String,
  serverAddress: String,
  usersOnline: Array,
  description: String,
  dateCreated: Date,
});

exports.Server = mongoose.model('Server', ServerSchema, 'servers');
