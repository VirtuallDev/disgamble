const https = require('https');
const fs = require('fs');
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const authRouter = require('./routers/auth');
const usersRouter = require('./routers/users');
const { SocketAuthMiddleware } = require('./middlewares/socket');
const nodeEvents = require('./nodeEvents');
const { User, Server } = require('./database');
const CLIENT_URL = process.env.CLIENT_URL;
const app = express();
const options = {
  key: fs.readFileSync('server.key'),
  cert: fs.readFileSync('server.crt'),
};

const server = https.createServer(options, app).listen(3000, () => console.log(`HTTPS server running on port ${3000}`));
// const server = app.listen(3000, () => console.log(`HTTP server running on port ${3000}`));

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

// Connection middleware
io.use(SocketAuthMiddleware);

io.on('connection', (socket) => {
  if (socket.userId) socket.join(socket.userId);
  socket.on('hello', (args) => {
    console.log(args);
  });
  socket.on('connectToServer', async (serverId) => {
    socket.leaveAll();
    socket.join(socket.userId);
    socket.join(serverId);
    const server = await Server.findOne({ serverId: serverId });
    socket.emit('serverConnected', server);
  });
  socket.on('icecandidate', async (icecandidate) => {
    console.log(icecandidate, 'icecandidate');
    io.emit('icecandidate', icecandidate, socket.userId);
  });
  socket.on('offer', async (offer) => {
    console.log(offer, 'offer');
    io.emit('offer', offer, socket.userId);
  });
  socket.on('answer', async (answer) => {
    console.log(answer, 'answer');
    io.emit('answer', answer, socket.userId);
  });
  socket.on('icecandidate', (candidate) => {
    io.emit('icecandidate', candidate);
  });
});

nodeEvents.on('friendChange', async (userId) => {
  const friend = await User.findOne({ userId: userId }, { username: 1, userId: 1, userImage: 1, status: 1, bio: 1, friends: 1 }).lean();
  const friendObject = friend;
  delete friendObject.friends;
  for (const friend of friend.friends) {
    io.to(`${friend}`).emit('friendChange', friendObject);
  }
});

nodeEvents.on('updateUser', (userId) => {
  io.to(`${userId}`).emit('updateUser');
});
