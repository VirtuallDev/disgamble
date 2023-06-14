const https = require('https');
const fs = require('fs');
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const authRouter = require('./routers/auth');
const usersRouter = require('./routers/users');
const nodeEvents = require('./nodeEvents');
const app = express();
const options = {
  key: fs.readFileSync('private.key'),
  ca: fs.readFileSync('ca_bundle.crt'),
  cert: fs.readFileSync('certificate.crt'),
};
const jwt = require('jsonwebtoken');
const path = require('path');

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

app.get('/images/:image', (req, res) => {
  const imageName = req.params.image;
  const imagePath = path.resolve(__dirname, 'images', imageName);
  res.setHeader('Cache-Control', 'public, max-age=3600');
  res.setHeader('Expires', new Date(Date.now() + 3600000).toUTCString());
  res.sendFile(imagePath);
});

app.use('/auth', authRouter);
app.use('', usersRouter);

const io = require('socket.io')(server, {
  cors: {
    origin: CLIENT_URL,
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

const { setupUserEvents } = require('./socketHandlers/socketUser');

setupUserEvents(io);

(async function cleanup() {
  console.log(count);
})();

io.use(async (socket, next) => {
  const token = socket.handshake.headers.authorization;
  const decoded = jwt.verify(token, JWT_SECRET);
  const userId = decoded.userId;
  socket.join(userId);
  socket.userId = userId;
  next();
});

io.on('connection', (socket) => {});

nodeEvents.on('user:updateUser', (userId) => {
  io.to(`${userId}`).emit('user:updateUser');
});
