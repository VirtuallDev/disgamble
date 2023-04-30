const { User } = require('./database');
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

exports.getUserInfoByAuthHeader = getUserInfoByAuthHeader;
exports.getUserByAccessToken = getUserByAccessToken;
