import { EventEmitter } from '@angular/core';
import { IConnection } from './iconnection';

export class Connection implements IConnection {
  public readonly remoteId: string;

  public readonly onConnectionLost = new EventEmitter<void>();
  public readonly onConnectionClosed = new EventEmitter<void>();
  public readonly onDataReceived = new EventEmitter<any>();
  public readonly onError = new EventEmitter<any>();

  private peerConnection: PeerJs.DataConnection;
  private _userInitiatedDisconnect = false;

  constructor(peerConnection: PeerJs.DataConnection) {
    this.remoteId = peerConnection.peer;
    this.peerConnection = peerConnection;
    this.setupEventHandlers();
  }

  get userInitiatedDisconnect() {
    return this.userInitiatedDisconnect;
  }

  send(data) {
    this.peerConnection.send(data);
  }

  disconnect() {
    this._userInitiatedDisconnect = true;
    this.peerConnection.close();
  }

  private onCloseHandler() {
    if (this._userInitiatedDisconnect) {
      this.onConnectionClosed.emit();
    } else {
      this.onConnectionLost.emit();
    }
  }

  private onDataHandler(data) {
    this.onDataReceived.emit(data);
  }

  private onErrorHandler(error) {
    this.onError.emit(error);
  }

  private setupEventHandlers() {
    this.peerConnection.on('close', () => this.onCloseHandler);
    this.peerConnection.on('data', data => this.onDataHandler(data));
    this.peerConnection.on('error', error => this.onErrorHandler(error));
  }
}
