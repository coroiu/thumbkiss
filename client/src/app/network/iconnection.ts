import { EventEmitter } from '@angular/core';

export interface IConnection {
  readonly onConnectionLost: EventEmitter<void>;
  readonly onConnectionClosed: EventEmitter<void>;
  readonly onDataReceived: EventEmitter<any>;
  readonly onError: EventEmitter<any>;

  send(data);
  disconnect();
}
