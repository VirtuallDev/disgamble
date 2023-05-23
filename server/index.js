const https = require('https');
const fs = require('fs');
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const authRouter = require('./routers/auth');
const usersRouter = require('./routers/users');
const nodeEvents = require('./nodeEvents');
const { User, Calls, Dm } = require('./database');
const app = express();
const options = {
  key: fs.readFileSync('private.key'),
  cert: fs.readFileSync('certificate.crt'),
};
const jwt = require('jsonwebtoken');

const server = https.createServer(options, app).listen(5001, () => console.log(`HTTPS server running on port ${5001}`));
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

const { setupDmEvents } = require('./socketHandlers/socketDm');
const { setupUserEvents } = require('./socketHandlers/socketUser');
const { setupWebRTCEvents } = require('./socketHandlers/socketWebRTC');
const { onDisconnect } = require('./utils');

setupDmEvents(io);
setupUserEvents(io);
setupWebRTCEvents(io);

(async function test() {
  const test = await Calls.deleteMany({});
  console.log(test);
})();

io.use(async (socket, next) => {
  try {
    const token = socket.handshake.headers.authorization;
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.userId;
    socket.join(userId);
    // Remove later
    socket.userId = userId;
  } catch (e) {}
  next();
});

io.on('connection', (socket) => {
  socket.on('disconnect', async () => {
    onDisconnect(io, socket.userId);
  });
});

nodeEvents.on('dm:messageAdded', async (messageObject) => {
  for (const user of messageObject?.recipients) {
    io.to(`${user}`).emit('dm:messageAdded', messageObject);
  }
});

nodeEvents.on('dm:messageUpdated', async (messageObject) => {
  for (const user of messageObject?.recipients) {
    io.to(`${user}`).emit('dm:messageUpdated', messageObject);
  }
});

nodeEvents.on('dm:messageDeleted', async (messageObject) => {
  for (const user of messageObject?.recipients) {
    io.to(`${user}`).emit('dm:messageDeleted', messageObject);
  }
});

nodeEvents.on('user:friendUpdate', async (userId) => {
  const user = await User.findOne({ 'userInfo.userId': userId }).lean();
  if (!user) return;
  nodeEvents.emit('user:updateUser', user.userInfo.userId);
  for (const friend of user.friends.friends) {
    io.to(`${friend}`).emit('user:friendUpdate', user);
  }
});

nodeEvents.on('user:updateUser', (userId) => {
  io.to(`${userId}`).emit('user:updateUser');
});
