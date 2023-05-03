const { User } = require('../database');
const nodeEvents = require('../nodeEvents');

function setupUserEvents(io) {
  io.on('connection', (socket) => {
    socket.on('user:addfriend', async (usernameToAdd) => {
      try {
        const { userId, username, userImage } = await User.findOne({ userId: socket.userId }, { username: 1, userId: 1, userImage: 1 });
        if (!userId) return;
        const updatedUser = await User.findOneAndUpdate({ username: usernameToAdd }, { $push: { friendRequests: { userId: userId, username: username, userImage: userImage } } });
        if (!updatedUser) return;

        // Error if already added
        nodeEvents.emit('user:friendUpdate', updatedUser.userId);
      } catch (e) {
        console.log(e);
      }
    });
    socket.on('user:accept', async (userIdToAccept) => {
      try {
        const { userId } = await User.findOne({ userId: socket.userId }, { userId: 1 });
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
    socket.on('user:decline', async (userIdToDecline) => {
      try {
        const { userId } = await User.findOne({ userId: socket.userId }, { userId: 1 });
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
    socket.on('user:changestatus', async (statusString) => {
      try {
        const { userId } = await User.findOne({ userId: socket.userId }, { userId: 1 });
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
