const { Server } = require('../database');

function setupServerEvents(io) {
  io.on('connection', (socket) => {
    socket.on('server:connect', async (serverId) => {
      const { userId } = await User.findOne({ userId: socket.userId }, { userId: 1 });
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
