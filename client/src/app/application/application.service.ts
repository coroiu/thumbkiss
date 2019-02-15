import { Injectable } from '@angular/core';
import { IdentityService } from '../identity/identity.service';
import { WebsocketConnection } from '../network/websocket-connection';
import { ConnectionState } from '../network/connection-state';

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {
  private connection: WebsocketConnection;
  private _remoteId: string;

  constructor(
    private identityService: IdentityService
  ) {
    this.connection = new WebsocketConnection(identityService.identity.id);
    this.connection.onDataReceived.subscribe(data => console.log('data:', data));
  }

  get groupId() {
    return this._remoteId;
  }

  set groupId(value: string) {
    this._remoteId = value;
    if (value !== undefined && value !== null) {
      this.connection.connect(value);
    }
  }

  get connectionState() {
    return ConnectionState.Disconnected;
  }
}
