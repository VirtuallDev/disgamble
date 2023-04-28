const jwt = require('jsonwebtoken');
const { User } = require('../database');

const JWT_SECRET = process.env.JWT_SECRET;

async function SocketAuthMiddleware(socket, next) {
  try {
    const token = socket.handshake.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.userId;
    const user = await User.findOne({ userId: userId }, { userId: 1 });
    socket.userId = user.userId;
    next();
  } catch (e) {
    next();
  }
}

exports.SocketAuthMiddleware = SocketAuthMiddleware;
