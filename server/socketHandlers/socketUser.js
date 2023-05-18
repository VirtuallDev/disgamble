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
        console.log(userId, 'added');
        // Error if already added
        nodeEvents.emit('user:friendUpdate', updatedUser.userId);
      } catch (e) {
        console.log(e);
      }
    });
    socket.on('user:accept', async (userIdToAccept) => {
      try {
        const user = await User.findOneAndUpdate(
          { userId: socket.userId },
          {
            $push: { friends: userIdToAccept },
            $pull: { friendRequests: { userId: userIdToAccept } },
          }
        );
        if (!user) return;
        nodeEvents.emit('user:friendUpdate', updatedUser.userId);
      } catch (e) {
        console.log(e);
      }
    });
    socket.on('user:decline', async (userIdToDecline) => {
      try {
        const user = await User.findOneAndUpdate(
          { userId: socket.userId },
          {
            $pull: { friendRequests: { userId: userIdToDecline } },
          }
        );
        if (!user) return;
        nodeEvents.emit('user:friendUpdate', updatedUser.userId);
      } catch (e) {
        console.log(e);
      }
    });
    socket.on('user:changestatus', async (statusString) => {
      try {
        if (!statusString && statusString !== 'Online' && statusString !== 'Invisible' && statusString !== 'DND') return res.status(500).json({ error: 'Something went wrong!' });
        const user = await User.findOneAndUpdate({ userId: socket.userId }, { status: statusString });
        if (!user) return res.status(500).json({ error: 'Something went wrong!' });
        nodeEvents.emit('user:friendUpdate', user.userId);
      } catch (e) {
        console.log(e);
      }
    });
    socket.on('user:changeUsername', async (username) => {
      try {
        const user = await User.findOneAndUpdate({ userId: socket.userId }, { username: username });
        if (!user) return res.status(500).json({ error: 'Something went wrong!' });
        nodeEvents.emit('user:friendUpdate', user.userId);
      } catch (e) {
        console.log(e);
      }
    });
    socket.on('user:changeEmail', async (email) => {
      try {
        const user = await User.findOneAndUpdate({ userId: socket.userId }, { email: email });
        if (!user) return res.status(500).json({ error: 'Something went wrong!' });
        nodeEvents.emit('user:friendUpdate', user.userId);
      } catch (e) {
        console.log(e);
      }
    });
    socket.on('user:changeAbout', async (about) => {
      try {
        const user = await User.findOneAndUpdate({ userId: socket.userId }, { about: about });
        if (!user) return res.status(500).json({ error: 'Something went wrong!' });
        nodeEvents.emit('user:friendUpdate', user.userId);
      } catch (e) {
        console.log(e);
      }
    });
  });
}

exports.setupUserEvents = setupUserEvents;
