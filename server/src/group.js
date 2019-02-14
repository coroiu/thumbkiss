class Group {
  constructor(server, name) {
    this.clients = new Map();
    this.server = server;
    this.name = name;
  }

  handleNewClient(clientId, client) {
    if (this.clients.size >= 2) {
      return;
    }

    this.clients.set(clientId, client);
    ws.on('message', function incoming(message) {
      console.log('received: %s', message);
    });
    ws.send('something');
  }
}

module.exports = Group;
