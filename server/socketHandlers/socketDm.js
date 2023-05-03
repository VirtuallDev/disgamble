const { User, Dm } = require('../database');
const crypto = require('crypto');
const nodeEvents = require('../nodeEvents');

function setupDmEvents(io) {
  io.on('connection', (socket) => {
    socket.on('dm:message', async (content, sendTo) => {
      try {
        const { userId, username, userImage } = await User.findOne({ userId: socket.userId }, { username: 1, userId: 1, userImage: 1 });
        if (!userId) return;
        const recipient = await User.findOne({ userId: sendTo }, { username: 1, userId: 1, userImage: 1 });
        if (!recipient) return;
        const messageObject = await Dm.create({
          authorId: userId,
          authorName: username,
          authorImage: userImage,
          recipientId: recipient.userId,
          recipientName: recipient.username,
          recipientImage: recipient.userImage,
          recipients: [userId, sendTo],
          message: content,
          messageId: crypto.randomBytes(16).toString('hex'),
          sentAt: Date.now(),
          edited: false,
        });
        nodeEvents.emit('dm:messageAdded', messageObject);
      } catch (e) {
        console.log(e);
      }
    });
    socket.on('dm:edit', async (messageId, newMessage) => {
      try {
        const { userId } = await User.findOne({ userId: socket.userId }, { userId: 1 });
        if (!userId) return;
        const edited = await Dm.findOneAndUpdate({ authorId: userId, messageId: messageId }, { message: newMessage, edited: true }, { new: true });
        if (!edited) return;
        nodeEvents.emit('dm:messageUpdated', edited);
      } catch (e) {
        console.log(e);
      }
    });
    socket.on('dm:delete', async (messageId) => {
      try {
        const { userId } = await User.findOne({ userId: socket.userId }, { userId: 1 });
        if (!userId) return;
        const deleted = await Dm.findOneAndDelete({ authorId: userId, messageId: messageId });
        if (!deleted) return;
        nodeEvents.emit('dm:messageDeleted', deleted);
      } catch (e) {
        console.log(e);
      }
    });
  });
}

exports.setupDmEvents = setupDmEvents;
