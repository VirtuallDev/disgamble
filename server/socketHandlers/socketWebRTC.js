const { Calls } = require('../database');

function setupWebRTCEvents(io) {
  io.on('connection', (socket) => {
    socket.on('webrtc:icecandidate', async (icecandidate) => {
      const isCaller = await Calls.findOne({ callerId: socket.userId, isConnected: true });
      const isNotCaller = await Calls.findOne({ callTo: socket.userId, isConnected: true });
      if (isCaller) io.to(`${isCaller.callTo}`).emit('webrtc:icecandidate', icecandidate);
      if (isNotCaller) io.to(`${isNotCaller.callerId}`).emit('webrtc:icecandidate', icecandidate);
    });

    socket.on('webrtc:offer', async (offer, userId) => {
      const callId = Math.random().toString(16).substring(2);
      const callObject = { callId: callId, callerId: socket.userId, callTo: userId, offer: offer, answer: '', isConnected: false };
      await Calls.create(callObject);
      setTimeout(async () => {
        const deleted = await Calls.deleteOne({ callId: callId, isConnected: false });
        if (deleted.deletedCount < 1) return;
        io.to(`${socket.userId}`).emit('user:deleteCall', callId);
        io.to(`${userId}`).emit('user:deleteCall', callId);
      }, 15000);
      io.to(`${userId}`).emit('user:call', callObject);
    });

    socket.on('user:answer', async (callId) => {
      const offer = await Calls.findOne({ callId: callId });
      if (offer && offer.callTo === socket.userId) io.to(`${socket.userId}`).emit('webrtc:offer', offer.offer, offer.callerId);
    });

    socket.on('webrtc:answer', async (answer, userId) => {
      const call = await Calls.findOne({ callerId: userId, callTo: socket.userId });
      if (call) {
        const updatedCall = await Calls.findOneAndUpdate({ callId: call.callId }, { answer: answer, isConnected: true }, { new: true });
        io.to(`${call.callId}`).emit('user:updateCall', updatedCall);
        io.to(`${call.callerId}`).emit('user:updateCall', updatedCall);
        io.to(`${userId}`).emit('webrtc:answer', answer);
      }
    });
  });
}

exports.setupWebRTCEvents = setupWebRTCEvents;
