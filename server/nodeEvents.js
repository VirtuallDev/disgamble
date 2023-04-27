const EventEmitter = require('events');

const myEmitter = new EventEmitter();
myEmitter.setMaxListeners(15);
module.exports = myEmitter;
