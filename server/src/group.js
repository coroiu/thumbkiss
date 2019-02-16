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
    client.on('message', (message) => {
      console.log('received: %s', message);
      this.clients.forEach((client, key) => {
        if (key !== clientId) {
          client.send(message);
        }
      })
    });

    client.on('close', () => {
      this.clients.delete(clientId);
    });
  }
}

module.exports = Group;
