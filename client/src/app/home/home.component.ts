import { Component, OnInit, OnDestroy } from '@angular/core';
import { IdentityService } from '../identity/identity.service';
import { Identity } from '../identity/identity';
import { ActivatedRoute } from '@angular/router';
import { ApplicationService } from '../application/application.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ConnectionState } from '../network/connection-state';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject();
  private identity: Identity;

  constructor(
    private identityService: IdentityService,
    private applicationService: ApplicationService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.identity = this.identityService.identity;
    this.route.paramMap
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(paramMap => this.applicationService.remoteId = paramMap.get('remoteId'));
  }

  get connectionState() {
    switch (this.applicationService.connectionState) {
      case ConnectionState.Connected:
        return 'Connected';
      case ConnectionState.Connecting:
        return 'Connecting';
      case ConnectionState.Disconnected:
        return 'Disconnected';
    }
  }

  get remoteId() {
    return this.applicationService.remoteId;
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
