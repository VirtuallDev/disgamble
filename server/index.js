const https = require('https');
const fs = require('fs');
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const authRouter = require('./routers/auth');
const usersRouter = require('./routers/users');
const nodeEvents = require('./nodeEvents');
const { User, Server, Dm } = require('./database');
const app = express();
const options = {
  key: fs.readFileSync('server.key'),
  cert: fs.readFileSync('server.crt'),
};
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const server = https.createServer(options, app).listen(3000, () => console.log(`HTTPS server running on port ${3000}`));
// const server = app.listen(3000, () => console.log(`HTTP server running on port ${3000}`));

const CLIENT_URL = process.env.CLIENT_URL;
const JWT_SECRET = process.env.JWT_SECRET;

app.use(cookieParser());
app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
  })
);

app.use(express.json());
app.use('/auth', authRouter);
app.use('', usersRouter);

const io = require('socket.io')(server, {
  cors: {
    origin: CLIENT_URL,
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

async function getUserByAccessToken(accessToken) {
  try {
    const decoded = jwt.verify(accessToken, JWT_SECRET);
    const userId = decoded.userId;
    const user = await User.findOne({ userId: userId }, { userId: 1, username: 1, userImage: 1 });
    if (!user) return null;
    return user;
  } catch (e) {
    console.log(e);
    return null;
  }
}

io.on('connection', (socket) => {
  socket.on('server:connect', async (accessToken, serverId) => {
    const { userId, username, userImage } = await getUserByAccessToken(accessToken);

    if (!userId) return;
    socket.leaveAll();
    socket.join(userId);
    socket.join(serverId);
    const server = await Server.findOne({ serverId: serverId });
    socket.emit('server:connected', server);
  });
  socket.on('webrtc:icecandidate', async (accessToken, icecandidate) => {
    const { userId, username, userImage } = await getUserByAccessToken(accessToken);

    if (!userId) return;
    console.log(icecandidate, 'icecandidate');
    io.emit('webrtc:icecandidate', icecandidate, userId);
  });
  socket.on('webrtc:offer', async (accessToken, offer) => {
    const { userId, username, userImage } = await getUserByAccessToken(accessToken);

    if (!userId) return;
    console.log(offer, 'offer');
    io.emit('webrtc:offer', offer, userId);
  });
  socket.on('webrtc:answer', async (accessToken, answer) => {
    const { userId, username, userImage } = await getUserByAccessToken(accessToken);

    if (!userId) return;
    console.log(answer, 'answer');
    io.emit('webrtc:answer', answer, userId);
  });
  socket.on('dm:message', async (accessToken, content, sendTo) => {
    try {
      const { userId, username, userImage } = await getUserByAccessToken(accessToken);
      if (!userId) return;
      await Dm.create({
        authorId: userId,
        authorName: username,
        authorImage: userImage,
        recipients: [userId, sendTo],
        message: content,
        messageId: crypto.randomBytes(16).toString('hex'),
        sentAt: Date.now(),
      });
      const user = await User.findOne({ userId: userId }, { username: 1, userId: 1, userImage: 1 }).lean();
      io.emit('dm:message', content, user.username, user.userId, user.userImage);
    } catch (e) {
      console.log(e);
    }
  });
  socket.on('dm:edit', async (accessToken, messageId, newMessage) => {
    try {
      const { userId, username, userImage } = await getUserByAccessToken(accessToken);
      if (!userId) return;
    } catch (e) {
      console.log(e);
    }
  });
  socket.on('dm:delete', async (accessToken, messageId) => {
    try {
      const { userId, username, userImage } = await getUserByAccessToken(accessToken);
      if (!userId) return;
    } catch (e) {
      console.log(e);
    }
  });
});

nodeEvents.on('user:friendUpdate', async (userId) => {
  const user = await User.findOne({ userId: userId }, { username: 1, userId: 1, userImage: 1, status: 1, bio: 1, friends: 1 }).lean();
  if (!user) return;
  for (const friend of user?.friends) {
    io.to(`${friend}`).emit('user:friendUpdate', user);
  }
});

nodeEvents.on('user:updateUser', (userId) => {
  io.to(`${userId}`).emit('user:updateUser');
});
