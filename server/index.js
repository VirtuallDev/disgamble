require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const authRouter = require('./routers/auth');
const usersRouter = require('./routers/users');
const { SocketAuthMiddleware } = require('./middlewares/socket');
const nodeEvents = require('./nodeEvents');
const { User } = require('./database');

const CLIENT_URL = process.env.CLIENT_URL;

const app = express();
app.use(cookieParser());
app.use(
  cors({
    origin: 'http://213.57.174.158:3001',
    credentials: true,
  })
);

app.use(express.json());
app.use('/auth', authRouter);
app.use('', usersRouter);

const server = app.listen(3000, () => console.log(`HTTP server running on port ${3000}`));

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
  socket.on('connectToServer', (serverId) => {
    socket.leaveAll();
    socket.join(socket.userId);
    socket.join(serverId);
  });
  socket.on('offer', async (offer) => {
    socket.emit('offer', offer);
  });
  socket.on('answer', async (answer) => {
    socket.emit('answer', answer);
  });
  socket.on('icecandidate', (candidate) => {
    socket.emit('icecandidate', candidate);
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
