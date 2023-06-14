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
