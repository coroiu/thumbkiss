import { Component, OnInit, HostListener } from '@angular/core';
import { ApplicationService } from '../application/application.service';
import { IConnection } from '../network/iconnection';

@Component({
  selector: 'app-virtual-glass',
  templateUrl: './virtual-glass.component.html',
  styleUrls: ['./virtual-glass.component.scss']
})
export class VirtualGlassComponent implements OnInit {
  private connection: IConnection;

  constructor(private application: ApplicationService) {
    this.connection = this.application.connection;
  }

  ngOnInit() {
  }

  @HostListener('touchmove', ['$event'])
  touchMove(event: TouchEvent) {
    this.connection.send(JSON.stringify({
      identifier: 0,
      x: event.touches[0].clientX,
      y: event.touches[0].clientY
    }));
    console.log(event);
  }
}
