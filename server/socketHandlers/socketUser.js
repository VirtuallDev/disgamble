const { User, Server } = require('../database');
const nodeEvents = require('../nodeEvents');

function setupUserEvents(io) {
  io.on('connection', (socket) => {
    //Finished
    socket.on('user:addfriend', async (usernameToAdd) => {
      try {
        const user = await User.findOne({ 'userInfo.userId': socket.userId });
        if (!user) return;
        const updatedUser = await User.findOneAndUpdate(
          {
            'userInfo.username': usernameToAdd,
            $nor: [{ 'friends.requests': user.userInfo.userId }, { 'friends.friends': user.userInfo.userId }],
          },
          { $push: { 'friends.requests': user.userInfo.userId } }
        );
        if (!updatedUser) return;
        nodeEvents.emit('user:friendUpdate', updatedUser.userInfo.userId);
      } catch (e) {
        console.log(e);
      }
    });
    socket.on('user:accept', async (userIdToAccept) => {
      try {
        const user = await User.findOneAndUpdate(
          {
            'userInfo.userId': socket.userId,
            'friends.requests': { $elemMatch: { $eq: userIdToAccept } },
          },
          {
            $push: { 'friends.friends': userIdToAccept },
            $pull: { 'friends.requests': userIdToAccept },
          }
        );
        if (!user) return;
        nodeEvents.emit('user:updateUser', user.userInfo.userId);
        const userToAccept = await User.findOneAndUpdate(
          { 'userInfo.userId': userIdToAccept },
          { $push: { 'friends.friends': user.userInfo.userId } }
        );
        if (!userToAccept) return;
        nodeEvents.emit('user:updateUser', userIdToAccept);
      } catch (e) {
        console.log(e);
      }
    });
    socket.on('user:decline', async (userIdToDecline) => {
      try {
        const user = await User.findOneAndUpdate(
          {
            'userInfo.userId': socket.userId,
            'friends.requests': { $elemMatch: { $eq: userIdToDecline } },
          },
          {
            $pull: { 'friends.requests': userIdToDecline },
          }
        );
        if (!user) return;
        nodeEvents.emit('user:updateUser', user.userInfo.userId);
      } catch (e) {
        console.log(e);
      }
    });
    socket.on('user:removeFriend', async (userToRemove) => {
      try {
        const user = await User.findOneAndUpdate(
          {
            'userInfo.userId': socket.userId,
            'friends.friends': { $elemMatch: { $eq: userToRemove } },
          },
          {
            $pull: { 'friends.friends': userToRemove },
          }
        );
        if (!user) return;
        nodeEvents.emit('user:updateUser', user.userInfo.userId);
        const friendToRemove = await User.findOneAndUpdate(
          {
            'userInfo.userId': userToRemove,
            'friends.friends': { $elemMatch: { $eq: user.userInfo.userId } },
          },
          {
            $pull: { 'friends.friends': user.userInfo.userId },
          }
        );
        if (!friendToRemove) return;
        nodeEvents.emit('user:updateUser', friendToRemove.userInfo.userId);
      } catch (e) {
        console.log(e);
      }
    });
    socket.on('user:changeStatus', async (statusString) => {
      try {
        if (!statusString || (statusString !== 'Online' && statusString !== 'Invisible' && statusString !== 'DND'))
          return res.status(500).json({ error: 'Something went wrong!' });
        const user = await User.findOneAndUpdate(
          { 'userInfo.userId': socket.userId },
          { 'userInfo.status': statusString, 'userInfo.userStatus': statusString }
        );
        if (!user) return res.status(500).json({ error: 'Something went wrong!' });
        nodeEvents.emit('user:friendUpdate', user.userInfo.userId);
      } catch (e) {
        console.log(e);
      }
    });
    socket.on('user:changeUsername', async (username) => {
      try {
        console.log(username);
        if (await User.findOne({ 'userInfo.username': username })) return;
        const user = await User.findOneAndUpdate(
          { 'userInfo.userId': socket.userId },
          { 'userInfo.username': username }
        );
        if (!user) return res.status(500).json({ error: 'Something went wrong!' });
        nodeEvents.emit('user:friendUpdate', user.userInfo.userId);
      } catch (e) {
        console.log(e);
      }
    });
    socket.on('user:changeAbout', async (about) => {
      try {
        if (typeof about !== 'string' || about.length > 150) return;
        const user = await User.findOneAndUpdate({ 'userInfo.userId': socket.userId }, { 'userInfo.about': about });
        if (!user) return res.status(500).json({ error: 'Something went wrong!' });
        nodeEvents.emit('user:friendUpdate', user.userInfo.userId);
      } catch (e) {
        console.log(e);
      }
    });
    socket.on('user:changeVoiceSettings', async (voiceObject) => {
      try {
        const { inputMode, key, volume } = voiceObject;
        if (!inputMode || !key || !volume) return;
        const user = await User.findOneAndUpdate({ 'userInfo.userId': socket.userId }, { voiceSettings: voiceObject });
        if (!user) return res.status(500).json({ error: 'Something went wrong!' });
        nodeEvents.emit('user:updateUser', user.userInfo.userId);
      } catch (e) {
        console.log(e);
      }
    });
    socket.on('user:changePassword', async (passwordObject) => {
      try {
        const { password, newPassword, confirmNewPassword } = passwordObject;
        if (!password || !newPassword || !confirmNewPassword) return;
        if (!newPassword.match(/^(?=.*[A-Za-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]+$/)) return;
        if (newPassword !== confirmNewPassword) return;
        const user = await User.findOne({ 'userInfo.userId': socket.userId });
        if (!user) return;
        const passwordHash = crypto.createHmac('sha256', user.userAuth.salt).update(password).digest('hex');
        const updatedUser = await User.findOneAndUpdate(
          { 'userAuth.password': passwordHash },
          { 'userAuth.password': newPassword }
        );
        if (!updatedUser) return;
        nodeEvents.emit('user:updateUser', updatedUser.userInfo.userId);
      } catch (e) {
        console.log(e);
      }
    });
    socket.on('user:createServer', async (serverObject) => {
      try {
        const { name, description } = serverObject;
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
            name: name,
            image: '',
            description: description,
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
//Finished
exports.setupUserEvents = setupUserEvents;
