const { User, Dm } = require('../database');
const crypto = require('crypto');
const nodeEvents = require('../nodeEvents');

function setupDmEvents(io) {
  io.on('connection', (socket) => {
    //Finished
    socket.on('dm:message', async (content, sendTo) => {
      try {
        if (typeof content !== 'string' || content.length > 150) return;
        const user = await User.findOne({ 'userInfo.userId': socket.userId });
        if (!user) return;
        const recipient = await User.findOne({ 'userInfo.userId': sendTo });
        if (!recipient) return;
        const messageObject = await Dm.create({
          author: {
            userId: user.userInfo.userId,
            username: user.userInfo.username,
            image: user.userInfo.image,
          },
          recipient: {
            userId: recipient.userInfo.userId,
            username: recipient.userInfo.username,
            image: recipient.userInfo.image,
          },
          message: {
            message: content,
            id: crypto.randomBytes(16).toString('hex'),
            sentAt: Date.now(),
            isEdited: false,
          },
          recipients: [user.userInfo.userId, sendTo],
        });
        nodeEvents.emit('dm:messageAdded', messageObject);
      } catch (e) {
        console.log(e);
      }
    });
    socket.on('dm:edit', async (id, content) => {
      try {
        if (typeof content !== 'string' || content.length > 150) return;
        const user = await User.findOne({ 'userInfo.userId': socket.userId });
        if (!user) return;
        const edited = await Dm.findOneAndUpdate({ 'author.userId': socket.userId, 'message.id': id }, { 'message.message': content, 'message.isEdited': true }, { new: true });
        if (!edited) return;
        nodeEvents.emit('dm:messageUpdated', edited);
      } catch (e) {
        console.log(e);
      }
    });
    socket.on('dm:delete', async (id) => {
      try {
        const user = await User.findOne({ 'userInfo.userId': socket.userId });
        if (!user) return;
        const deleted = await Dm.findOneAndDelete({ 'author.userId': socket.userId, 'message.id': id });
        if (!deleted) return;
        nodeEvents.emit('dm:messageDeleted', deleted);
      } catch (e) {
        console.log(e);
      }
    });
    //Finished
  });
}

exports.setupDmEvents = setupDmEvents;
