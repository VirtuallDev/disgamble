require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { setupChatEvents } = require('./socketChat');
const { User } = require('./database');
const crypto = require('crypto');

const CLIENT_URL = 'http://localhost:5173';

const app = express();
app.use(cookieParser());
app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
  })
);

app.use(express.json());

const server = app.listen(3000, () => console.log(`HTTP server running on port ${3000}`));

const io = require('socket.io')(server, {
  cors: {
    origin: CLIENT_URL,
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

setupChatEvents(io);

app.post('/login', async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  if (!password || !email) return res.send({ error: 'Invalid credentials' });
  if (email && !email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g)) return res.send({ error: 'Invalid email!' });

  const verify = await User.findOne({ email: email }, { email: 1, password: 1, salt: 1 });
  if (!verify) return res.send({ error: "User doesn't exist" });

  const passwordHash = crypto.createHmac('sha256', verify.salt).update(password).digest('hex');
  const verifyPassword = passwordHash === verify.password;

  if (!verifyPassword) return res.send({ error: 'Wrong password' });
  // dbcount // 3 tries // Hashed pass
  const refreshToken = 'Bla';
  await User.findOneAndUpdate(
    { email: email },
    {
      $set: {
        refreshToken: { refreshToken, issued: Date.now() },
      },
    }
  );
  return res
    .status(200)
    .cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    })
    .send({ success: 'Logged In' })
    .redirect(`${CLIENT_URL}/`);
});

app.post('/register', async (req, res) => {
  try {
    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.password;
    const dateOfBirth = req.body.date;

    const salt = crypto.randomBytes(16).toString('hex');
    const passwordHash = crypto.createHmac('sha256', salt).update(password).digest('hex');
    const userId = crypto.randomBytes(32).toString('hex');

    await User.create({
      username: username,
      email: email,
      password: passwordHash,
      salt: salt,
      userId: userId,
      userImage: '',
      status: '',
      bio: '',
      friends: [],
      friendRequests: [],
      blockedUsers: [],
      communityList: [],
      sessionToken: {},
      dateOfBirth: dateOfBirth,
    });
    return res.status(200).send({ success: 'Successfully Registered!' });
  } catch (e) {
    // Change status code
    return res.status(200).send({ error: 'Error' });
  }
});

app.post('/logout', async (req, res) => {
  const userID = '';
  await User.findOneAndUpdate(
    { userId: userID },
    {
      $set: {
        refreshToken: { refreshToken: null, issued: Date.now() },
      },
    }
  );
  return res
    .status(200)
    .cookie('refreshToken', '', {
      httpOnly: true,
      maxAge: 1,
    })
    .redirect(`${CLIENT_URL}/`);
});
