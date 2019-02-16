import { Component, OnInit, HostListener } from '@angular/core';
import { ApplicationService } from '../application/application.service';
import { IConnection } from '../network/iconnection';
import { TouchMoveMessage } from '../network/touch-move-message';
import { TouchEndMessage } from '../network/touch-end-message';
import { TouchStartMessage } from '../network/touch-start-message';

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

  @HostListener('touchstart', ['$event'])
  touchStart(event: TouchEvent) {
    this.connection.send<TouchStartMessage>({
      type: 'touchStart',
      identifier: 0
    });
  }

  @HostListener('touchmove', ['$event'])
  touchMove(event: TouchEvent) {
    this.connection.send<TouchMoveMessage>({
      type: 'touchMove',
      identifier: 0,
      x: event.touches[0].clientX,
      y: event.touches[0].clientY
    });
  }

  @HostListener('touchend', ['$event'])
  touchEnd(event: TouchEvent) {
    this.connection.send<TouchEndMessage>({
      type: 'touchEnd',
      identifier: 0
    });
  }
}
