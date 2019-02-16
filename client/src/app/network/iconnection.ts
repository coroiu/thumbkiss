import { EventEmitter } from '@angular/core';
import { Message } from './message';

export interface IConnection {
  readonly onConnectionLost: EventEmitter<void>;
  readonly onConnectionClosed: EventEmitter<void>;
  readonly onDataReceived: EventEmitter<Message>;
  readonly onError: EventEmitter<any>;

  send<T extends Message>(data: T);
  disconnect();
}
