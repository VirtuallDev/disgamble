require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const authRouter = require('./routers/auth');
const { SocketAuthMiddleware } = require('./middlewares/socket');
const { User, Server } = require('./database');
const { getUserInfoByAuthHeader } = require('./utils');

const CLIENT_URL = process.env.CLIENT_URL;

const app = express();
app.use(cookieParser());
app.use(
  cors({
    origin: 'http://localhost:3001',
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

app.get('/getuserinfo', getUserInfoByAuthHeader, async (req, res) => {
  try {
    const user = await User.findOne(
      { userId: req.userID },
      { username: 1, userId: 1, userImage: 1, status: 1, bio: 1, friends: 1, friendRequests: 1, blockedUsers: 1, serverList: 1, _id: 0 }
    );
    const friends = await User.find({ userId: { $in: user.friends } }, { username: 1, userId: 1, userImage: 1, status: 1 });
    if (friends) user.friends = friends;
    const servers = await Server.find({ serverId: { $in: user.serverList } }, { serverId: 1, serverImage: 1, servername: 1 });
    if (servers) user.serverList = servers;
    return res.status(200).json({ success: user });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ error: 'Something went wrong!' });
  }
});

app.post('/changestatus', getUserInfoByAuthHeader, async (req, res) => {
  try {
    const { statusString } = req.body;
    if (!statusString && statusString !== 'Online' && statusString !== 'Invisible' && statusString !== 'DND') return res.status(500).json({ error: 'Something went wrong!' });
    const user = await User.findOneAndUpdate({ userId: req.userID }, { status: statusString });
    if (!user) return res.status(500).json({ error: 'Something went wrong!' });
    return res.status(200).json({ success: 'Status changed successfully.' });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ error: 'Something went wrong!' });
  }
});

// Connection middleware
io.use(SocketAuthMiddleware);

io.on('connection', (socket) => {
  if (socket.userId) socket.join(socket.userId);
  socket.on('hello', (args) => {
    console.log(args);
  });

  socket.on('offer', async (offer) => {
    // Receive the offer from the remote client

    const peerConnection = new RTCPeerConnection(configuration);

    offer.sdp = offer.sdp.replace(/a=sendrecv\n/g, 'a=sendonly\n');

    await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    stream.getTracks().forEach((track) => {
      peerConnection.addTrack(track, stream);
    });

    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(new RTCSessionDescription(answer));

    socket.emit('answer', answer);
    // Send the answer back to the remote client
  });

  socket.on('answer', async (answer) => {
    // Receive the answer from the remote client
    await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
  });

  socket.on('icecandidate', (event) => {
    // Receive the ICE candidate from the remote client
    if (event.candidate) {
      socket.emit('icecandidate', event.candidate);
    }
  });
});
