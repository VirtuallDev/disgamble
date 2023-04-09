const { Server } = require("socket.io");
const { clientEvents } = require("./events");

/**
 * 
 * @param {Server} io 
 */
function setupChatEvents(io) {
  io.on("connection", (socket) => {
    socket.on("message", (raw) => {
      const {e: event, d: data} = raw;
      if(!clientEvents.includes(e))
      switch(e) {
        case 'HEARTBEAT':
          return;
      }
    })
  });
}

exports.setupChatEvents = setupChatEvents;
