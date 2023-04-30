const { User } = require('../database');
const { getUserByAccessToken } = require('../utils');
const nodeEvents = require('../nodeEvents');

function setupUserEvents(io) {
  io.on('connection', (socket) => {
    socket.on('user:addfriend', async (accessToken, usernameToAdd) => {
      try {
        const { userId, userImage, username } = await getUserByAccessToken(accessToken);
        if (!userId) return;
        const updatedUser = await User.findOneAndUpdate({ username: usernameToAdd }, { $push: { friendRequests: { userId: userId, username: username, userImage: userImage } } });
        if (!updatedUser) return;

        // Error if already added
        nodeEvents.emit('user:friendUpdate', updatedUser.userId);
      } catch (e) {
        console.log(e);
      }
    });
    socket.on('user:accept', async (accessToken, userIdToAccept) => {
      try {
        const { userId } = await getUserByAccessToken(accessToken);
        if (!userId) return;
        const updatedUser = await User.findOneAndUpdate(
          { userId: userId },
          {
            $push: { friends: userIdToAccept },
            $pull: { friendRequests: { userId: userIdToAccept } },
          }
        );
        if (!updatedUser) return;
        nodeEvents.emit('user:friendUpdate', updatedUser.userId);
      } catch (e) {
        console.log(e);
      }
    });
    socket.on('user:decline', async (accessToken, userIdToDecline) => {
      try {
        const { userId } = await getUserByAccessToken(accessToken);
        if (!userId) return;
        const updatedUser = await User.findOneAndUpdate(
          { userId: userId },
          {
            $pull: { friendRequests: { userId: userIdToDecline } },
          }
        );
        if (!updatedUser) return;
        nodeEvents.emit('user:friendUpdate', updatedUser.userId);
      } catch (e) {
        console.log(e);
      }
    });
    socket.on('user:changestatus', async (accessToken, statusString) => {
      try {
        const { userId } = await getUserByAccessToken(accessToken);
        if (!userId) return;
        if (!statusString && statusString !== 'Online' && statusString !== 'Invisible' && statusString !== 'DND') return res.status(500).json({ error: 'Something went wrong!' });
        const user = await User.findOneAndUpdate({ userId: userId }, { status: statusString });
        if (!user) return res.status(500).json({ error: 'Something went wrong!' });
        nodeEvents.emit('user:friendUpdate', user.userId);
      } catch (e) {
        console.log(e);
      }
    });
  });
}

exports.setupUserEvents = setupUserEvents;
