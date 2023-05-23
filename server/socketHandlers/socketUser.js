const { User } = require('../database');
const nodeEvents = require('../nodeEvents');

function setupUserEvents(io) {
  io.on('connection', (socket) => {
    socket.on('user:addfriend', async (usernameToAdd) => {
      try {
        const user = await User.findOne({ 'userInfo.userId': socket.userId });
        if (!user) return;
        const updatedUser = await User.findOneAndUpdate(
          { username: usernameToAdd },
          { $push: { 'friends.requests': { userId: user.userInfo.userId, username: user.userInfo.username, image: user.userInfo.image } } }
        );
        if (!updatedUser) return;
        // Error if already added
        nodeEvents.emit('user:friendUpdate', updatedUser.userInfo.userId);
      } catch (e) {
        console.log(e);
      }
    });
    socket.on('user:accept', async (userIdToAccept) => {
      try {
        const user = await User.findOneAndUpdate(
          { 'userInfo.userId': socket.userId },
          {
            $push: { 'friends.friends': userIdToAccept },
            $pull: { 'friends.requests': { userId: userIdToAccept } },
          }
        );
        if (!user) return;
        nodeEvents.emit('user:friendUpdate', user.userInfo.userId);
      } catch (e) {
        console.log(e);
      }
    });
    socket.on('user:decline', async (userIdToDecline) => {
      try {
        const user = await User.findOneAndUpdate(
          { 'userInfo.userId': socket.userId },
          {
            $pull: { 'friends.requests': { userId: userIdToDecline } },
          }
        );
        if (!user) return;
        nodeEvents.emit('user:friendUpdate', user.userInfo.userId);
      } catch (e) {
        console.log(e);
      }
    });
    socket.on('user:changestatus', async (statusString) => {
      try {
        if (!statusString && statusString !== 'Online' && statusString !== 'Invisible' && statusString !== 'DND') return res.status(500).json({ error: 'Something went wrong!' });
        const user = await User.findOneAndUpdate({ 'userInfo.userId': socket.userId }, { 'userInfo.status': statusString });
        if (!user) return res.status(500).json({ error: 'Something went wrong!' });
        nodeEvents.emit('user:friendUpdate', user.userInfo.userId);
      } catch (e) {
        console.log(e);
      }
    });
    socket.on('user:changeUsername', async (username) => {
      try {
        const user = await User.findOneAndUpdate({ 'userInfo.userId': socket.userId }, { 'userInfo.username': username });
        if (!user) return res.status(500).json({ error: 'Something went wrong!' });
        nodeEvents.emit('user:friendUpdate', user.userInfo.userId);
      } catch (e) {
        console.log(e);
      }
    });
    socket.on('user:changeEmail', async (email) => {
      try {
        const user = await User.findOneAndUpdate({ 'userInfo.userId': socket.userId }, { 'userInfo.email': email });
        if (!user) return res.status(500).json({ error: 'Something went wrong!' });
        nodeEvents.emit('user:friendUpdate', user.userInfo.userId);
      } catch (e) {
        console.log(e);
      }
    });
    socket.on('user:changeAbout', async (about) => {
      try {
        const user = await User.findOneAndUpdate({ 'userInfo.userId': socket.userId }, { 'userInfo.about': about });
        if (!user) return res.status(500).json({ error: 'Something went wrong!' });
        nodeEvents.emit('user:friendUpdate', user.userInfo.userId);
      } catch (e) {
        console.log(e);
      }
    });
  });
}

exports.setupUserEvents = setupUserEvents;
