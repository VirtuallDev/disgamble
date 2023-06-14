const { User } = require('../database');
const nodeEvents = require('../nodeEvents');

function setupUserEvents(io) {
  io.on('connection', (socket) => {});
}
exports.setupUserEvents = setupUserEvents;
