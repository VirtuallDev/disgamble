const { User, Calls } = require('./database');
const jwt = require('jsonwebtoken');
const nodeEvents = require('./nodeEvents');

const JWT_SECRET = process.env.JWT_SECRET;

async function getUserInfoByAuthHeader(req, res, next) {
  try {
    const token = req.headers.authorization.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'You are not logged in.' });
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.userId;
    const user = await User.findOne({ 'userInfo.userId': userId });
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
    const user = await User.findOne({ 'userInfo.userId': userId });
    if (!user) return null;
    return user;
  } catch (e) {
    return null;
  }
}

async function onConnection(userId) {
  try {
    if (!userId) return;
    const user = await User.findOne({ 'userInfo.userId': userId });
    if (!user) return;
    await User.findOneAndUpdate({ 'userInfo.userId': userId }, { 'userInfo.status': user.userInfo.userStatus });
    console.log('updated', user.userInfo.userStatus);
    nodeEvents.emit('user:friendUpdate', user.userInfo.userId);
  } catch (e) {
    console.log(e);
  }
}

async function onDisconnect(io, userId) {
  if (!userId) return;
  try {
    const user = await User.findOneAndUpdate({ 'userInfo.userId': userId }, { 'userInfo.status': 'Offline' });
    if (!user) return;
    console.log('updated offline');
    nodeEvents.emit('user:friendUpdate', user.userInfo.userId);
  } catch (e) {
    console.log(e);
  }
  try {
    const call = await Calls.findOne({ $or: [{ 'author.userId': userId }, { 'recipient.userId': userId }] });
    if (call) {
      io.to(`${call.author.userId}`).emit('webrtc:disconnect');
      io.to(`${call.author.userId}`).emit('user:deleteCall', call.callId);
      if (call.isConnected) {
        io.to(`${call.recipient.userId}`).emit('webrtc:disconnect');
        io.to(`${call.recipient.userId}`).emit('user:deleteCall', call.callId);
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
    io.to(`${callObject.author.userId}`).emit('webrtc:disconnect');
    io.to(`${callObject.author.userId}`).emit('user:deleteCall', callObject.callId);
    io.to(`${callObject.recipient.userId}`).emit('user:deleteCall', callObject.callId);
    if (callObject.isConnected) io.to(`${callObject.recipient.userId}`).emit('webrtc:disconnect');
    await Calls.deleteOne({ callId: callObject.author.userId });
  } catch (e) {
    console.log(e);
  }
}

exports.getUserInfoByAuthHeader = getUserInfoByAuthHeader;
exports.getUserByAccessToken = getUserByAccessToken;
exports.onDisconnect = onDisconnect;
exports.onCallEnd = onCallEnd;
exports.onConnection = onConnection;
