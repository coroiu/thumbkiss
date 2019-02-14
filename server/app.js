const WebSocket = require('ws');
const Thumbkiss = require('./src/thumbkiss');

const wss = new WebSocket.Server({ port: 10000 });

const thumbkiss = new Thumbkiss(wss);

// wss.on('connection', function connection(ws, req) {
//   const group = req.headers['x-group'];
//   ws.on('message', function incoming(message) {
//     console.log('received: %s', message);
//   });
//   ws.send('something');
// });
