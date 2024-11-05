const express = require('express');
const cors = require('cors');
const { getToken, emailChecker, hashPassword, passwordChecker, tokenVerifier, verifyPassword } = require('./auth');
const mongoose = require('mongoose');
const roomRoutes = require('./routes/rooms');
const http = require('http');
const twilio = require('twilio');
const setupSignalingServer = require('./signaling');

// const twilioAccountSID = '';
// const twilioAuthToken = '';
// const twilioClient = twilio(twilioAccountSID, twilioAuthToken);

const app = express();
const port = 8001;

/**
 * The async function initialize the mongodb and returns its models
 * */
async function initMongodb() {

  //Connect to MongoDB

  // url_test is the url of the tesing database
  const url_buzzlink = 'mongodb+srv://krishkp00:urFavMRfZYDYF0Ez@buzzlinkcluster.7figs.mongodb.net/BuzzLink?retryWrites=true&w=majority&appName=BuzzLinkCluster';
  const url_test = 'mongodb+srv://krishkp00:urFavMRfZYDYF0Ez@buzzlinkcluster.7figs.mongodb.net/?retryWrites=true&w=majority&appName=BuzzLinkCluster';

  console.log('trying to connect mongoose');
  
  await mongoose.connect(url_test);

  console.log('MongoDB connection established');

  const usersSchema = new mongoose.Schema({
    displayName: String,
    email: String,
    password: String,
  }, {
    collection: 'Users'
  });

  const roomsSchema = new mongoose.Schema({
    roomName: String,
    roomType: String,
    participantLimit: Number,
    participants: [{ type: mongoose.Schema.ObjectId, ref: 'Users'}],
    createdBy: { type: mongoose.Schema.ObjectId, ref: 'Users'}

  }, {
    collection: 'Rooms'
  });

  const sessionsSchema = new mongoose.Schema({
    
  }, {
    collection: 'Sessions'
  });

  const Users = mongoose.model('Users', usersSchema);
  const Rooms = mongoose.model('Rooms', roomsSchema);
  const Sessions = mongoose.model('Sessions', sessionsSchema);

  return { Users, Rooms, Sessions };
}

const server = http.createServer(app);

app.use(cors());

app.use(express.json()); // store request body in req.body

app.use('/api/rooms', roomRoutes);

setupSignalingServer(server);

async function runServer() {

  const { Users } = await initMongodb();

  app.post('/register', emailChecker, passwordChecker, async (req, res) => {

    // request body may be something like this
    const { email, password, displayName } = req.body;

    if (!displayName) {
      res.status(400).send('No displayName provided');
      return;
    }

    // Check if there exists an account with the same email
    const found = await Users.findOne({ email });
    if (found) {
      res.status(400).send('Email already exists');
      return;
    }

    // hash the password and then insert into db
    const hashed = await hashPassword(password);
    const insertBody = {
      email,
      password: hashed,
      displayName
    };

    try {
      await Users.create(insertBody);
      res.send('Register succeeds');
    } catch (err) {
      console.log('error when trying to insert: ', insertBody);
      console.log('err: ', err);
      res.status(400).send('Register fails');
    }
  });

  app.post('/login', emailChecker, passwordChecker, async (req, res) => {
    const { email, password } = req.body;
    // const found = await users.findOne({ email });
    const found = await Users.findOne({ email });

    // if not such email
    if (found === null) {
      res.status(400).send('The email is not registered');
      return;
    }

    // If the password is incorrect, end there
    // Otherwise, generate and send back the token
    const match = await verifyPassword(password, found.password);
    if (!match) {
      res.status(400).send('The password is incorrect');
      return;
    }

    const tokenPayload = {
      id: found._id,
      displayName: found.displayName,
      email: found.email,
    };
    const token = getToken(tokenPayload);
    res.send(token);
  });

  app.post('/reset-password', tokenVerifier, async (req, res) => {
    const { newPassword } = req.body;
    if (!newPassword) {
      res.status(400).send('No new password provided');
      return;
    }

    // hash the new password and then update the db
    const newHashedPassword = await hashPassword(newPassword);
    try {
      await Users.updateOne({
        email: req.tokenBody.email
      }, {
        $set: { password: newHashedPassword }
      });
      res.send('Update succeeds');
    } catch (err) {
      console.log('error when updating: ', req.tokenBody);
      console.log('err: ', err);
      res.status(400).send('Update fails');
    }
  });

  // app.get('/ice', async (req, res) => {
  //   try {
  //     const token = await twilioClient.tokens.create();
  //     res.json(token.iceServers);
  //   } catch (err) {
  //     console.error('Error generating twilio token:', err); 
  //     res.status(500).send('Error generating twilio token');
  //   }
  // });

  app.get('/test', tokenVerifier, async (req, res) => {
    // a test endpoint to get data for a user
    try {
      const result = await Users.findOne({
        email: req.tokenBody.email
      });
      res.send(result);
    } catch (err) {
      console.log('err: ', err);
      res.status(400).send('err ');
    }
  });

  app.get('/hello', (req, res) => {
    res.send('The answer for hello!');
  });

const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {
  console.log('A new client connected!');

  // Send a welcome message to the client
  //ws.send('Welcome to the chat server!');

  // Handle incoming messages from clients
  ws.on('message', (message) => {
    console.log(`Received: ${message}`);

    // Broadcast the message to all connected clients
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  // Handle connection close
  ws.on('close', () => {
    console.log('A client disconnected');
  });
  });

  console.log('WebSocket server started on ws://localhost:8080');

  server.listen(port, () => {
    console.log('the server is running at: ', port);
  });

  //--------------------------------------------------------
  // Setup WebSocket server
 /** const WebSocket = require('ws');
  const url = require('url');

  // Create a WebSocket server on port 8080
  const wss = new WebSocket.Server({ port: 8080 });

  console.log('WebSocket server started on ws://localhost:8080');

  // Maintain a mapping of chatrooms and their connected clients
  const chatrooms = {};

  wss.on('connection', (ws, req) => {
  // Parse the chatroom ID from the URL
  const pathname = url.parse(req.url).pathname;
  const chatroomId = pathname.split('/')[2];

  if (!chatroomId) {
    ws.close(1008, 'Chatroom ID is required');
    return;
  }

  // Add the WebSocket connection to the appropriate chatroom
  if (!chatrooms[chatroomId]) {
    chatrooms[chatroomId] = new Set();
  }
  chatrooms[chatroomId].add(ws);

  console.log(`Client connected to chatroom: ${chatroomId}`);

  // Handle incoming messages from a client
  ws.on('message', (message) => {
    console.log(`Received in chatroom ${chatroomId}: ${message}`);

    // Broadcast the message to all clients in the chatroom except the sender
    chatrooms[chatroomId].forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(`Chatroom ${chatroomId}: ${message}`);
      }
    });
  });

  // Remove the WebSocket connection when it closes
  ws.on('close', () => {
    console.log(`Client disconnected from chatroom: ${chatroomId}`);
    chatrooms[chatroomId].delete(ws);
    if (chatrooms[chatroomId].size === 0) {
      delete chatrooms[chatroomId]; // Clean up empty chatrooms
    }
  });
}); **/

}

runServer();



