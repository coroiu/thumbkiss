import { IConnection } from './iconnection';
import { EventEmitter } from '@angular/core';
import { Message } from './message';

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
    this.socket.onopen = this.openHandler.bind(this);
    this.socket.onmessage = this.messageHandler.bind(this);
    this.socket.onclose = this.closeHandler.bind(this);
    this.socket.onerror = this.errorHandler.bind(this);
  }

  send(data: Message) {
    this.socket.send(JSON.stringify(data));
  }

  disconnect() {
    this.socket.close();
    this.socket = undefined;
  }

  private openHandler(event: Event) {
  }

  private messageHandler(event: MessageEvent) {
    this.onDataReceived.emit(JSON.parse(event.data));
  }

  private closeHandler(event: CloseEvent) {
    this.onConnectionClosed.emit();
  }

  private errorHandler(event: Event) {

  }
}
