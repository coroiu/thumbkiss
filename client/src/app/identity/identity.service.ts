import { Injectable } from '@angular/core';
import { Identity } from './identity';

@Injectable({
  providedIn: 'root'
})
export class IdentityService {
  private readonly ID_KEY = 'id';

  constructor() {}

  get identity(): Identity {
    const str = localStorage.getItem(this.ID_KEY);
    let identity: Identity;

    if (str === undefined || str === null) {
      identity = new Identity();
      this.identity = identity;
    } else {
      const obj = JSON.parse(str);
      identity = new Identity(obj.id, obj.color);
    }

    return identity;
  }

  set identity(identity: Identity) {
    const str = JSON.stringify({
      id: identity.id,
      color: identity.color
    });
    localStorage.setItem(this.ID_KEY, str);
  }
}
