const express = require('express');
const router = express.Router();
const { User, Server, Dm } = require('../database');
const { getUserInfoByAuthHeader } = require('../utils');
const nodeEvents = require('../nodeEvents');
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
    const user = await User.findOne(
      { userId: req.userID },
      { username: 1, userId: 1, userImage: 1, status: 1, bio: 1, friends: 1, friendRequests: 1, blockedUsers: 1, serverList: 1 }
    ).lean();
    const friends = await User.find({ userId: { $in: user.friends } }, { username: 1, userId: 1, userImage: 1, status: 1 }).lean();
    user.friends = friends || [];
    const servers = await Server.find({}, { servername: 1, serverId: 1, serverImage: 1, serverAddress: 1, usersOnline: 1, description: 1, dateCreated: 1 }).lean();
    for (const server of servers) {
      const usersOnline = await User.find({ userId: { $in: server.usersOnline } }, { username: 1, userId: 1, userImage: 1 }).lean();
      server.usersOnline = usersOnline || [];
    }
    user.serverList = servers || [];
    user.ads = adsArray;
    return res.json({ success: user });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ error: 'Something went wrong!' });
  }
});

router.get('/ads', (req, res) => {
  try {
    const adsArray = [
      'https://images.pexels.com/photos/268533/pexels-photo-268533.jpeg?cs=srgb&dl=pexels-pixabay-268533.jpg&fm=jpg',
      'https://media.istockphoto.com/id/517188688/photo/mountain-landscape.jpg?s=612x612&w=0&k=20&c=A63koPKaCyIwQWOTFBRWXj_PwCrR4cEoOw2S9Q7yVl8=',
      'https://gratisography.com/wp-content/uploads/2023/02/gratisography-colorful-kittenfree-stock-photo-800x525.jpg',
      'https://images.ctfassets.net/hrltx12pl8hq/a2hkMAaruSQ8haQZ4rBL9/8ff4a6f289b9ca3f4e6474f29793a74a/nature-image-for-website.jpg?fit=fill&w=480&h=320',
      'https://images.pexels.com/photos/674010/pexels-photo-674010.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
    ];
    return res.status(200).json({ success: adsArray });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ error: 'Something went wrong!' });
  }
});

router.get('/server/:id', async (req, res) => {
  try {
    const server = await Server.findOne({ serverId: req.params.id });
    if (!server) return res.status(500).json({ error: 'Something went wrong!' });
    return res.status(200).json({ success: server });
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

module.exports = router;
