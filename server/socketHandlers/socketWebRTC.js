const { Calls } = require('../database');
const { onDisconnect, onCallEnd } = require('../utils');

function setupWebRTCEvents(io) {
  io.on('connection', (socket) => {
    socket.on('webrtc:icecandidate', async (icecandidate) => {
      try {
        const isCaller = await Calls.findOne({ callerId: socket.userId, isConnected: true });
        const isNotCaller = await Calls.findOne({ callTo: socket.userId, isConnected: true });
        if (isCaller) io.to(`${isCaller.callTo}`).emit('webrtc:icecandidate', icecandidate);
        if (isNotCaller) io.to(`${isNotCaller.callerId}`).emit('webrtc:icecandidate', icecandidate);
      } catch (e) {
        console.log(e);
      }
    });

    socket.on('webrtc:offer', async (offer, userId) => {
      try {
        const callId = Math.random().toString(16).substring(2);
        const callObject = { callId: callId, callerId: socket.userId, callTo: userId, offer: offer, answer: '', isConnected: false };
        await Calls.create(callObject);
        setTimeout(async () => {
          onCallEnd(io, callId);
        }, 15000);
        io.to(`${socket.userId}`).emit('user:call', callObject);
        io.to(`${userId}`).emit('user:call', callObject);
      } catch (e) {
        console.log(e);
      }
    });

    socket.on('user:answer', async (callId) => {
      try {
        const offer = await Calls.findOne({ callId: callId });
        if (offer && offer.callTo === socket.userId) io.to(`${socket.userId}`).emit('webrtc:offer', offer.offer, offer.callerId);
      } catch (e) {
        console.log(e);
      }
    });

    socket.on('webrtc:answer', async (answer, userId) => {
      try {
        const call = await Calls.findOne({ callerId: userId, callTo: socket.userId });
        if (call) {
          const updatedCall = await Calls.findOneAndUpdate({ callId: call.callId }, { answer: answer, isConnected: true }, { new: true });
          io.to(`${call.callTo}`).emit('user:updateCall', updatedCall);
          io.to(`${call.callerId}`).emit('user:updateCall', updatedCall);
          io.to(`${userId}`).emit('webrtc:answer', answer);
        }
      } catch (e) {
        console.log(e);
      }
    });

    socket.on('user:callDisconnect', async (callId) => {
      try {
        onCallEnded(io, callId);
      } catch (e) {
        console.log(e);
      }
    });

    socket.on('user:disconnect', async () => {
      onDisconnect(io, socket.userId);
    });
  });
}

exports.setupWebRTCEvents = setupWebRTCEvents;
