import { Injectable } from '@angular/core';
import { IdentityService } from '../identity/identity.service';
import { WebsocketConnection } from '../network/websocket-connection';
import { ConnectionState } from '../network/connection-state';
import { IConnection } from '../network/iconnection';

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {
  private websocketConnection: WebsocketConnection;
  private _remoteId: string;

  constructor(
    private identityService: IdentityService
  ) {
    this.websocketConnection = new WebsocketConnection(identityService.identity.id);
    this.websocketConnection.onDataReceived.subscribe(data => console.log('data:', data));
  }

  get groupId() {
    return this._remoteId;
  }

  set groupId(value: string) {
    this._remoteId = value;
    if (value !== undefined && value !== null) {
      this.websocketConnection.connect(value);
    }
  }

  get connection(): IConnection {
    return this.websocketConnection;
  }

  get connectionState() {
    return ConnectionState.Disconnected;
  }
}
