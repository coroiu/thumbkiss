import { EventEmitter } from '@angular/core';
import { IConnection } from './iconnection';
import { OutgoingConnection } from './outgoing-connection';
import { Connection } from './connection';
import { Subscription } from 'rxjs';
import { ConnectionState } from './connection-state';

export class NetworkConnection implements IConnection {
  private static readonly PREFIX = 'thumbkiss';

  public readonly onConnectionLost = new EventEmitter<void>();
  public readonly onConnectionClosed = new EventEmitter<void>();
  public readonly onDataReceived = new EventEmitter<any>();
  public readonly onError = new EventEmitter<any>();

  private peer: PeerJs.Peer;
  private connection: IConnection;
  private connectionLostSubscription: Subscription;
  private connectionClosedSubscription: Subscription;
  private dataReceivedSubscription: Subscription;
  private errorSubscription: Subscription;
  private _connectionState: ConnectionState = ConnectionState.Disconnected;

  constructor(id: string) {
    this.peer = new Peer(`${NetworkConnection.PREFIX}_${id}`, { 
      debug: 3,
      config: {
        'iceServers': [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'turn:numb.viagenie.ca:3478', credential: 'muazkh', username: 'webrtc@live.com' },
          { urls: 'turn:numb.viagenie.ca', credential: 'muazkh', username: 'webrtc@live.com' },
          { urls: 'turn:numb.viagenie.ca:3478', credential: 'peerjsdemo', username: 'p.srikanta@gmail.com' },
          { urls: 'turn:192.158.29.39:3478?transport=udp', credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=', username: '28224511:1379330808' },
          { urls: 'turn:192.158.29.39:3478?transport=tcp', credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=', username: '28224511:1379330808' },
        ]
      }
    });

    this.peer.on('connection', conn => this.handleNewIncomingConnection(conn));
  }

  get remoteId() {
    if (this.connection !== undefined) {
      return this.connection.remoteId;
    }
    return undefined;
  }

  get connectionState() {
    return this._connectionState;
  }

  connect(remoteId: string) {
    this._connectionState = ConnectionState.Connecting;
    this.setupNewConnection(new OutgoingConnection(this.peer, `${NetworkConnection.PREFIX}_${remoteId}`));

    window.setTimeout(() => this.connection.send('lol wat message from master'), 1000);
    console.log(this.connection);
  }

  send(data) {
    if (this._connectionState === ConnectionState.Disconnected) {
      throw new Error('Cannot send data when disconnected');
    }
    this.connection.send(data);
  }

  disconnect() {
    this.connection.disconnect();
  }

  private handleNewIncomingConnection(connection: PeerJs.DataConnection) {
    if (!connection.peer.startsWith(NetworkConnection.PREFIX)) {
      connection.close();
      return;
    }
    this._connectionState = ConnectionState.Connecting;
    this.setupNewConnection(new Connection(connection));
    console.log(this.connection);
  }

  private connectionLostHandler() {
    this.teardownConnection();
    this.onConnectionLost.emit();
  }

  private connectionClosedHandler() {
    this.teardownConnection();
    this.onConnectionClosed.emit();
  }

  private dataReceivedHandler(data) {
    this._connectionState = ConnectionState.Connected;
    this.onDataReceived.emit(data);
  }

  private errorHandler(error) {
    this.teardownConnection();
    this.onError.emit(error);
  }

  private setupNewConnection(connection: IConnection) {
    this.unsubscribeToConnectionEvents();
    this.connection = connection;
    this.subscribeToConnectionEvents();
  }

  private teardownConnection() {
    this.unsubscribeToConnectionEvents();
    this.connection = undefined;
    this._connectionState = ConnectionState.Disconnected;
  }

  private subscribeToConnectionEvents() {
    this.connectionLostSubscription = this.connection.onConnectionLost.subscribe(() => this.connectionLostHandler);
    this.connectionClosedSubscription = this.connection.onConnectionClosed.subscribe(() => this.connectionClosedHandler);
    this.dataReceivedSubscription = this.connection.onDataReceived.subscribe(data => this.dataReceivedHandler(data));
    this.errorSubscription = this.connection.onError.subscribe(error => this.errorHandler(error));
  }

  private unsubscribeToConnectionEvents() {
    if (this.connectionLostSubscription !== undefined) {
      this.connectionLostSubscription.unsubscribe();
    }
    if (this.connectionClosedSubscription !== undefined) {
      this.connectionClosedSubscription.unsubscribe();
    }
    if (this.dataReceivedSubscription !== undefined) {
      this.dataReceivedSubscription.unsubscribe();
    }
    if (this.errorSubscription !== undefined) {
      this.errorSubscription.unsubscribe();
    }
  }
}
