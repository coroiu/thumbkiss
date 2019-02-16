import { Component, OnInit, HostListener } from '@angular/core';
import { ApplicationService } from '../application/application.service';
import { IConnection } from '../network/iconnection';
import { TouchMoveMessage, isTouchMoveMessage } from '../network/touch-move-message';
import { TouchEndMessage, isTouchEndMessage } from '../network/touch-end-message';
import { TouchStartMessage, isTouchStartMessage } from '../network/touch-start-message';
import { FingerState } from './finger-state';

@Component({
  selector: 'app-virtual-glass',
  templateUrl: './virtual-glass.component.html',
  styleUrls: ['./virtual-glass.component.scss']
})
export class VirtualGlassComponent implements OnInit {
  private connection: IConnection;
  private fingers: FingerState[];

  constructor(private application: ApplicationService) {
    this.connection = this.application.connection;
    this.fingers = new Array(10);
    for (let i = 0; i < this.fingers.length; ++i) {
      this.fingers[i] = { isTouching: false, x: 0, y: 0 };
    }
  }

  ngOnInit() {
    this.connection.onDataReceived.subscribe(message => {
      if (isTouchStartMessage(message)) {
        this.fingers[message.identifier] = {
          isTouching: true,
          x: message.x,
          y: message.y
        };
      } else if (isTouchMoveMessage(message)) {
        this.fingers[message.identifier] = {
          isTouching: true,
          x: message.x,
          y: message.y
        };
      } else if (isTouchEndMessage(message)) {
        this.fingers[message.identifier] = {
          isTouching: false,
          x: 0,
          y: 0
        };
      }
    });
  }

  @HostListener('touchstart', ['$event'])
  touchStart(event: TouchEvent) {
    this.connection.send<TouchStartMessage>({
      type: 'touchStart',
      identifier: 0,
      x: event.touches[0].clientX,
      y: event.touches[0].clientY
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

  counter(i: number) {
    return new Array(i);
  }
}
