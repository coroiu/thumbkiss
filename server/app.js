const Http = require('http');
const Path = require('path');
const Express = require('express');
const WebSocket = require('ws');
const Thumbkiss = require('./src/thumbkiss');

const express = Express();
const port = 4200;

express.use('/', Express.static('../client/dist/thumbkiss'))
express.get('*', (req, res) => {
  res.sendFile(Path.resolve(__dirname + '/../client/dist/thumbkiss/index.html'));
});

const server = Http.createServer(express);
const wss = new WebSocket.Server({ server });
const thumbkiss = new Thumbkiss(wss);

server.listen(4200, () => console.log(`Thumbkiss listening on port ${port}!`));

// express.listen(port, () => console.log(`Example app listening on port ${port}!`));

// wss.on('connection', function connection(ws, req) {
//   const group = req.headers['x-group'];
//   ws.on('message', function incoming(message) {
//     console.log('received: %s', message);
//   });
//   ws.send('something');
// });
