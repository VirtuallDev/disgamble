const https = require('https');
const fs = require('fs');
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const authRouter = require('./routers/auth');
const usersRouter = require('./routers/users');
const nodeEvents = require('./nodeEvents');
const { User } = require('./database');
const app = express();
const options = {
  key: fs.readFileSync('server.key'),
  cert: fs.readFileSync('server.crt'),
};

const server = https.createServer(options, app).listen(3000, () => console.log(`HTTPS server running on port ${3000}`));
// const server = app.listen(3000, () => console.log(`HTTP server running on port ${3000}`));

const CLIENT_URL = process.env.CLIENT_URL;

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
const { setupServerEvents } = require('./socketHandlers/socketServer');
const { setupUserEvents } = require('./socketHandlers/socketUser');
const { setupWebRTCEvents } = require('./socketHandlers/socketWebRTC');
const { getUserByAccessToken } = require('./utils');

setupDmEvents(io);
setupServerEvents(io);
setupUserEvents(io);
setupWebRTCEvents(io);

/*(async function test() {
  const test = await User.find({});
  console.log(test);
})();
*/

io.on('connection', (socket) => {
  socket.on('initialConnection', async (accessToken) => {
    if (!accessToken) return;
    const { userId } = await getUserByAccessToken(accessToken);
    if (!userId) return;
    socket.join(userId);
  });
});

nodeEvents.on('dm:messageAdded', async (messageObject) => {
  for (const user of messageObject?.recipients) {
    io.to(`${user}`).emit('dm:messageAdded', messageObject);
  }
});

nodeEvents.on('dm:messageUpdated', async (messageObject) => {
  console.log(messageObject.message);
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
  const user = await User.findOne({ userId: userId }, { username: 1, userId: 1, userImage: 1, status: 1, bio: 1, friends: 1 }).lean();
  if (!user) return;
  nodeEvents.emit('user:updateUser', user.userId);
  for (const friend of user?.friends) {
    io.to(`${friend}`).emit('user:friendUpdate', user);
  }
});

nodeEvents.on('user:updateUser', (userId) => {
  io.to(`${userId}`).emit('user:updateUser');
});
