const Group = require('./group');

class Thumbkiss { 

  constructor(server) {
    this.groups = new Map();
    this.server = server;

    this.server.on('connection', (ws, req) => {
      const params = new URL(`http://fakehost${req.url}`).searchParams;
      const clientId = params.get('clientId');
      const groupId = params.get('groupId');
      if (clientId == undefined || groupId == undefined) return;
      this.handleNewConnection(ws, groupId, clientId);
    });
  }

  handleNewConnection(client, groupId, clientId) {
    console.log(`New connection received with groupId: ${groupId}, clientId: '${clientId}'`);
    const group = this.getOrCreateGroup(groupId);
    group.handleNewClient(client, clientId);
  }

  getOrCreateGroup(groupId) {
    if (this.groups.has(groupId)) {
      return this.groups.get(groupId);
    }
    const group = new Group(groupId, this.server);
    this.groups.set(groupId, group);
    return group;
  }
}

module.exports = Thumbkiss;
