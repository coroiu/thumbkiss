import { Connection } from './connection';
import { IConnection } from './iconnection';
import { EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';

export class OutgoingConnection implements IConnection {
  public readonly remoteId: string;
  public readonly onConnectionLost = new EventEmitter<void>();
  public readonly onConnectionClosed = new EventEmitter<void>();
  public readonly onDataReceived = new EventEmitter<any>();
  public readonly onError = new EventEmitter<any>();

  private _state: '';
  private peer: PeerJs.Peer;
  private connection: Connection;
  private connectionLostSubscription: Subscription;
  private connectionClosedSubscription: Subscription;
  private dataReceivedSubscription: Subscription;
  private errorSubscription: Subscription;

  constructor(peer: PeerJs.Peer, remoteId: string) {
    this.remoteId = remoteId;
    this.peer = peer;
    this.connect();
  }

  send(data) {
    this.connection.send(data);
  }

  disconnect() {
    this.connection.disconnect();
  }

  private connect() {
    this.unsubscribeToConnectionEvents();
    this.connection = new Connection(this.peer.connect(this.remoteId));
    this.subscribeToConnectionEvents();
  }

  private connectionLostHandler() {
    window.setTimeout(this.connect, 500);
  }

  private connectionClosedHandler() {
    this.unsubscribeToConnectionEvents();
    this.onConnectionClosed.emit();
  }

  private dataReceivedHandler(data) {
    this.onDataReceived.emit(data);
  }

  private errorHandler(error) {
    this.onError.emit(error);
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
