class Group {
  constructor(server, name) {
    this.clients = new Map();
    this.server = server;
    this.name = name;
  }

  handleNewClient(client, clientId) {
    if (this.clients.size >= 2) {
      return;
    }

    this.clients.set(clientId, client);
    client.on('message', function incoming(message) {
      console.log('received: %s', message);
    });
    client.send('something');
    client.close();
  }
}

module.exports = Group;
