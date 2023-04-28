const { User } = require('./database');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

async function getUserInfoByAuthHeader(req, res, next) {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.userId;
    const user = await User.findOne({ userId: userId }, { userId: 1 });
    if (!user) return res.status(401).json({ error: 'You are not logged in.' });
    req.userID = userId;
    next();
  } catch (e) {
    console.log(e);
    return res.status(401).json({ error: 'You are not logged in.' });
  }
}

exports.getUserInfoByAuthHeader = getUserInfoByAuthHeader;
