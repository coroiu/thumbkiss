import { IConnection } from './iconnection';
import { EventEmitter } from '@angular/core';

export class WebsocketConnection implements IConnection {
  public onConnectionLost = new EventEmitter<void>();
  public onConnectionClosed = new EventEmitter<void>();
  public onDataReceived = new EventEmitter<any>();
  public onError = new EventEmitter<any>();

  private socket: WebSocket;
  private id: string;

  constructor(id: string) {
    this.id = id;
  }

  connect(groupId: string) {
    console.log('connecting');
    this.socket = new WebSocket(`ws://${location.host}?clientId=${this.id}&groupId=${groupId}`);
  }

  send(data: any) {
    throw new Error('Method not implemented.');
  }

  disconnect() {
    throw new Error('Method not implemented.');
  }
}
