const { User, Server } = require('../database');
const nodeEvents = require('../nodeEvents');

function setupUserEvents(io) {
  io.on('connection', (socket) => {
    socket.on('user:addfriend', async (usernameToAdd) => {
      try {
        const user = await User.findOne({ 'userInfo.userId': socket.userId });
        if (!user) return;
        const updatedUser = await User.findOneAndUpdate({ 'userInfo.username': usernameToAdd }, { $push: { 'friends.requests': user.userInfo.userId } });
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
            $pull: { 'friends.requests': userIdToAccept },
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
            $pull: { 'friends.requests': userIdToDecline },
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
        const user = await User.findOneAndUpdate({ 'userInfo.userId': socket.userId }, { 'userInfo.status': statusString, 'userInfo.userStatus': statusString });
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
    socket.on('user:changeAbout', async (about) => {
      try {
        const user = await User.findOneAndUpdate({ 'userInfo.userId': socket.userId }, { 'userInfo.about': about });
        if (!user) return res.status(500).json({ error: 'Something went wrong!' });
        nodeEvents.emit('user:friendUpdate', user.userInfo.userId);
      } catch (e) {
        console.log(e);
      }
    });
    socket.on('user:changeVoiceSettings', async (voiceObject) => {
      try {
        // Check if voiceObject is valid
        const user = await User.findOneAndUpdate({ 'userInfo.userId': socket.userId }, { voiceSettings: voiceObject });
        if (!user) return res.status(500).json({ error: 'Something went wrong!' });
        nodeEvents.emit('user:userUpdate', user.userInfo.userId);
      } catch (e) {
        console.log(e);
      }
    });
    socket.on('user:changePassword', async (passwordObject) => {
      try {
        // Check if passwordObject is valid
        // const user = await User.findOneAndUpdate({ 'userInfo.userId': socket.userId }, { voiceSettings: voiceObject });
        if (!user) return res.status(500).json({ error: 'Something went wrong!' });
        nodeEvents.emit('user:userUpdate', user.userInfo.userId);
      } catch (e) {
        console.log(e);
      }
    });
    socket.on('user:createServer', async (serverObject) => {
      try {
        // Check if serverObject is valid
        const user = await User.findOneAndUpdate({ 'userInfo.userId': socket.userId });
        if (!user) return res.status(500).json({ error: 'Something went wrong!' });
        const serverCount = await Server.find({});
        await Server.create({
          author: {
            userId: user.userInfo.userId,
            username: user.userInfo.username,
            image: user.userInfo.image,
          },
          server: {
            name: serverObject.name,
            image: '',
            description: serverObject.description,
            dateCreated: Date.now(),
            usersOnline: [],
            id: serverCount.length,
          },
        });
      } catch (e) {
        console.log(e);
      }
    });
  });
}

exports.setupUserEvents = setupUserEvents;
