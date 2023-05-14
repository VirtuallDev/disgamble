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
  try {
    if (!userId) return;
    const call = await Calls.findOne({ $or: [{ callerId: userId }, { callTo: userId }] });
    if (call) {
      io.to(`${call.callerId}`).emit('webrtc:disconnect');
      io.to(`${call.callerId}`).emit('user:deleteCall', call.callId);
      if (call.isConnected) {
        io.to(`${call.callTo}`).emit('webrtc:disconnect');
        io.to(`${call.callTo}`).emit('user:deleteCall', call.callId);
      }
      await Calls.deleteOne({ callId: call.callId });
    }
  } catch (e) {
    console.log(e);
  }
}

async function onCallEnd(io, condition) {
  try {
    if (!condition.callId) return;
    const callObject = await Calls.findOne(condition);
    if (!callObject) return;
    io.to(`${callObject.callerId}`).emit('webrtc:disconnect');
    io.to(`${callObject.callerId}`).emit('user:deleteCall', callObject.callId);
    io.to(`${callObject.callTo}`).emit('user:deleteCall', callObject.callId);
    if (callObject.isConnected) io.to(`${callObject.callTo}`).emit('webrtc:disconnect');
    await Calls.deleteOne({ callId: callObject.callId });
  } catch (e) {
    console.log(e);
  }
}

exports.getUserInfoByAuthHeader = getUserInfoByAuthHeader;
exports.getUserByAccessToken = getUserByAccessToken;
exports.onDisconnect = onDisconnect;
exports.onCallEnd = onCallEnd;
