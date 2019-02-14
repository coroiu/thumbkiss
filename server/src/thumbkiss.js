const Group = require('./group');

class Thumbkiss { 

  constructor(server) {
    this.groups = new Map();
    this.server = server;

    this.server.on('connection', (ws, req) => {
      const id = req.headers['x-id'];
      const group = req.headers['x-group'];
      if (id == undefined || group == undefined) return;
      this.handleNewConnection(ws, group, id);
    });
  }

  handleNewConnection(client, groupName, clientId) {
    const group = this.getOrCreateGroup(groupName);
    group.handleNewClient(client, clientId);
  }

  getOrCreateGroup(groupName) {
    if (this.groups.has(groupName)) {
      return this.groups.get(groupName);
    }
    const group = new Group(this.server, groupName);
    this.groups.set(groupName, group);
    return group;
  }
}

module.exports = Thumbkiss;
