class Group {
  constructor(id, server) {
    this.clients = new Map();
    this.server = server;
    this.id = id;
  }

  handleNewClient(client, clientId) {
    if (this.clients.has(clientId)) {
      this.clients.get(clientId).close();
      this.clients.delete(clientId);
    }

    if (this.clients.size >= 2) {
      return;
    }

    this.clients.set(clientId, client);
    client.on('message', function incoming(message) {
      console.log('received: %s', message);
    });
    client.send(`groupId: ${this.id}, clientId: ${clientId}`);
  }
}

module.exports = Group;
