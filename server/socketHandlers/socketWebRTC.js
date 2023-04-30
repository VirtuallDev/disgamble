const { getUserByAccessToken } = require('../utils');

function setupWebRTCEvents(io) {
  io.on('connection', (socket) => {
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
  });
}

exports.setupWebRTCEvents = setupWebRTCEvents;
