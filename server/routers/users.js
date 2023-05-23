const express = require('express');
const router = express.Router();
const { User, Server, Dm } = require('../database');
const { getUserInfoByAuthHeader } = require('../utils');
const multer = require('multer');
router.use(getUserInfoByAuthHeader);

const adsArray = [
  'https://images.pexels.com/photos/268533/pexels-photo-268533.jpeg?cs=srgb&dl=pexels-pixabay-268533.jpg&fm=jpg',
  'https://media.istockphoto.com/id/517188688/photo/mountain-landscape.jpg?s=612x612&w=0&k=20&c=A63koPKaCyIwQWOTFBRWXj_PwCrR4cEoOw2S9Q7yVl8=',
  'https://gratisography.com/wp-content/uploads/2023/02/gratisography-colorful-kittenfree-stock-photo-800x525.jpg',
  'https://images.ctfassets.net/hrltx12pl8hq/a2hkMAaruSQ8haQZ4rBL9/8ff4a6f289b9ca3f4e6474f29793a74a/nature-image-for-website.jpg?fit=fill&w=480&h=320',
  'https://images.pexels.com/photos/674010/pexels-photo-674010.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
];

router.get('/getuserinfo', async (req, res) => {
  try {
    const user = await User.findOne({ 'userInfo.userId': req.userID }).lean();
    const friends = await User.find({ 'userInfo.userId': { $in: user.friends.friends } }).lean();
    user.friends.friends = friends || [];
    const servers = await Server.find({}).lean();
    for (const server of servers) {
      const usersOnline = await User.find({ 'userInfo.userId': { $in: server.usersOnline } }).lean();
      server.usersOnline = usersOnline || [];
    }
    user.serverList = servers || [];
    user.ads = adsArray || [];
    return res.json({ success: user });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ error: 'Something went wrong!' });
  }
});

router.get('/dmhistory', async (req, res) => {
  try {
    const dmhistory = await Dm.find({ recipients: { $in: [req.userID] } }).lean();
    if (dmhistory.length === 0) return res.status(500).json({ error: 'Something went wrong!' });
    return res.status(200).json({ success: dmhistory });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ error: 'Something went wrong!' });
  }
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const fileExtension = file.originalname.split('.').pop();
    cb(null, `${req.userID}.${fileExtension}`);
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
    return res.status(200).json({ success: 'Uploaded successfully' });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ error: 'Something went wrong!' });
  }
});

module.exports = router;
