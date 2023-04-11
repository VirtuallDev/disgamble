require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { authRouter } = require('./routers/auth');

const CLIENT_URL = process.env.CLIENT_URL;

const app = express();
app.use(cookieParser());
app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
  })
);
app.use(express.json());

app.use('/auth', authRouter);

const server = app.listen(3000, () => console.log(`HTTP server running on port ${3000}`));

const io = require('socket.io')(server, {
  cors: {
    origin: CLIENT_URL,
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

io.on('connection', (socket) => {
  console.log('connected', socket.id);
});
