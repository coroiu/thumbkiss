import { Injectable } from '@angular/core';
import { IdentityService } from '../identity/identity.service';
import { NetworkConnection } from '../network/network-connection';

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {
  private networkConnection: NetworkConnection;
  private _remoteId: string;

  constructor(
    private identityService: IdentityService
  ) {
    this.networkConnection = new NetworkConnection(identityService.identity.id);
    this.networkConnection.onDataReceived.subscribe(data => console.log('wat:', data));
  }

  get remoteId() {
    return this._remoteId;
  }

  set remoteId(value: string) {
    this._remoteId = value;
    if (value !== undefined && value !== null) {
      this.networkConnection.connect(value);
    }
  }

  get connectionState() {
    return this.networkConnection.connectionState;
  }
}
