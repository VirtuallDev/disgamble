require("dotenv").config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { setupChatEvents } = require('./socketChat');
const { User }  = require("./database");

const CLIENT_URL = 'http://localhost:5173';

const app = express(); 
app.use(cookieParser());
app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
  })
);

app.use(express.json());

const server = app.listen(3000, () => console.log(`HTTP server running on port ${3000}`));

const io = require('socket.io')(server, {
  cors: {
    origin: CLIENT_URL,
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

setupChatEvents(io);

app.post('/login', async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  if(!password || !email) return res.send({error: "Invalid credentials"});
  if(email && !email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g)) return res.send({error: "Invalid email!"});

  const verifyEmail = await User.findOne({email: email}, {email: 1, password: 1})
  if(!verifyEmail) return res.send({error: "User doesn't exist"})
  const verifyPassword = verifyEmail.password === password
  if(!verifyPassword) return res.send({error: "Wrong password"})
  // dbcount // 3 tries // Hashed pass
  const refreshToken = 'Bla'
  await User.findOneAndUpdate({email: email }, {$set: {
    refreshToken: { refreshToken, issued: Date.now()}
 } })
  return res
  .status(200)
  .cookie("refreshToken", refreshToken, {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
  }).send({success: "Logged In"})
  .redirect(`${CLIENT_URL}/`);
})

app.post('/register', async (req, res) => {
  const email = req.body.email
  const username = req.body.username
  const password = req.body.password
  const dateOfBirth = req.body.date;
  // Write to db
  // regex
  await User.create({
    username: username,
    email: email,
    password: password,
    userId: "",
    status: "",
    bio: "",
    friends: [],
    friendRequests: [],
    blockedUsers: [],
    communityList: [],
    sessionToken: {},
  });
})

app.post("/logout", async (req, res) => {
  const userID = ""
    await User.findOneAndUpdate(
      { userId: userID },
      {
        $set: {
          refreshToken: { refreshToken: null, issued: Date.now() },
        },
      }
    );
    return res
      .status(200)
      .cookie("refreshToken", "", {
        httpOnly: true,
        maxAge: 1,
      })
      .redirect(`${CLIENT_URL}/`);
});
