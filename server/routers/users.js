const express = require('express');
const router = express.Router();
const { User, Server } = require('../database');
const { getUserInfoByAuthHeader } = require('../utils');

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
      { username: 1, userId: 1, userImage: 1, status: 1, bio: 1, friends: 1, friendRequests: 1, blockedUsers: 1, serverList: 1, _id: 0 }
    ).lean();
    const friends = await User.find({ userId: { $in: user.friends } }, { username: 1, userId: 1, userImage: 1, status: 1 });
    if (friends) user.friends = friends;
    // const servers = await Server.find({ serverId: { $in: user.serverList } }, { serverId: 1, serverImage: 1, servername: 1 });
    // if (servers) user.serverList = servers;
    const servers = await Server.find().lean();
    if (servers) user.serverList = servers;
    user.ads = adsArray;
    return res.status(200).json({ success: user });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ error: 'Something went wrong!' });
  }
});

router.post('/changestatus', async (req, res) => {
  try {
    const { statusString } = req.body;
    if (!statusString && statusString !== 'Online' && statusString !== 'Invisible' && statusString !== 'DND') return res.status(500).json({ error: 'Something went wrong!' });
    const user = await User.findOneAndUpdate({ userId: req.userID }, { status: statusString });
    if (!user) return res.status(500).json({ error: 'Something went wrong!' });
    return res.status(200).json({ success: 'Status changed successfully.' });
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

module.exports = router;
