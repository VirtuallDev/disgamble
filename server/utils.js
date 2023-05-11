const { User, Calls } = require('./database');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

async function getUserInfoByAuthHeader(req, res, next) {
  try {
    const token = req.headers.authorization.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'You are not logged in.' });
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.userId;
    const user = await User.findOne({ userId: userId }, { userId: 1 });
    if (!user) return res.status(401).json({ error: 'You are not logged in.' });
    req.userID = userId;
    next();
  } catch (e) {
    return res.status(401).json({ error: 'You are not logged in.' });
  }
}

async function getUserByAccessToken(accessToken) {
  try {
    if (!accessToken) return null;
    const decoded = jwt.verify(accessToken, JWT_SECRET);
    const userId = decoded.userId;
    const user = await User.findOne({ userId: userId }, { userId: 1, username: 1, userImage: 1 });
    if (!user) return null;
    return user;
  } catch (e) {
    return null;
  }
}

async function onDisconnect(io, userId) {
  if (!userId) return;
  const isCaller = await Calls.findOne({ callerId: userId });
  const isNotCaller = await Calls.findOne({ callTo: userId });
  if (isCaller) {
    io.to(`${isCaller.callerId}`).emit('webrtc:disconnect');
    io.to(`${isCaller.callerId}`).emit('user:deleteCall', isCaller.callId);
    if (isCaller.isConnected) {
      io.to(`${isCaller.callTo}`).emit('webrtc:disconnect');
      io.to(`${isCaller.callTo}`).emit('user:deleteCall', isCaller.callId);
    }
  }
  if (isNotCaller) {
    io.to(`${isNotCaller.callerId}`).emit('webrtc:disconnect');
    io.to(`${isNotCaller.callerId}`).emit('user:deleteCall', isNotCaller.callId);
    if (isNotCaller.isConnected) {
      io.to(`${isNotCaller.callTo}`).emit('webrtc:disconnect');
      io.to(`${isNotCaller.callTo}`).emit('user:deleteCall', isNotCaller.callId);
    }
  }
}

async function onCallEnd(io, callId) {
  if (!callId) return;
  const callObject = await Calls.findOne({ callId: callId });
  if (!callObject) return;
  io.to(`${callObject.callerId}`).emit('webrtc:disconnect');
  io.to(`${callObject.callerId}`).emit('user:deleteCall', callObject.callId);
  io.to(`${callObject.callTo}`).emit('user:deleteCall', callObject.callId);
  if (callObject.isConnected) io.to(`${callObject.callTo}`).emit('webrtc:disconnect');
  await Calls.deleteOne({ callId: callId });
}

exports.getUserInfoByAuthHeader = getUserInfoByAuthHeader;
exports.getUserByAccessToken = getUserByAccessToken;
exports.onDisconnect = onDisconnect;
exports.onCallEnd = onCallEnd;
