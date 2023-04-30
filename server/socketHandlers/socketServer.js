const { Server } = require('../database');
const { getUserByAccessToken } = require('../utils');

function setupServerEvents(io) {
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
  });
}

exports.setupServerEvents = setupServerEvents;
