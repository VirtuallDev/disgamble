const express = require('express');
const router = express.Router();
const { User, Server, Dm } = require('../database');
const { getUserInfoByAuthHeader } = require('../utils');
const multer = require('multer');
router.use(getUserInfoByAuthHeader);

router.get('/getuserinfo', async (req, res) => {
  try {
    const user = await User.findOne({ 'userInfo.userId': req.userID }).lean();
    const friends = await User.find({ 'userInfo.userId': { $in: user.friends.friends } }).lean();
    const requests = await User.find({ 'userInfo.userId': { $in: user.friends.requests } }).lean();
    user.friends.friends = friends || [];
    user.friends.requests = requests || [];
    const servers = await Server.find({}).lean();
    user.serverList = servers || [];
    user.ads = adsArray || [];
    return res.json({ success: user });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ error: 'Something went wrong!' });
  }
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'images/');
  },
  filename: function (req, file, cb) {
    const fileExtension = file.originalname.split('.').pop();
    req.imgName = `${req.userID}.${fileExtension}`;
    cb(null, req.imgName);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    if (!file.mimetype.startsWith('image/')) return cb(new Error('Only image files are allowed!'));
    cb(null, true);
  },
  limits: { fileSize: 8 * 1024 * 1024 },
});

router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { 'userInfo.userId': req.userID },
      { 'userInfo.image': `https://doriman.yachts:5001/images/${req.imgName}` }
    );
    if (!user) return res.status(500).json({ error: 'Something went wrong!' });
    return res.status(200).json({ success: 'Uploaded successfully' });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ error: 'Something went wrong!' });
  }
});

module.exports = router;
