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
  private debugFinger: FingerState = { isTouching: true, x: 50, y: 50 };

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
    event.preventDefault();
    this.touchChanged(event, 'touchStart');
  }

  @HostListener('touchmove', ['$event'])
  touchMove(event: TouchEvent) {
    event.preventDefault();
    this.touchChanged(event, 'touchMove');
  }

  touchChanged(event: TouchEvent, messageType: 'touchStart' | 'touchMove') {
    const length = event.changedTouches.length;
    let touch: Touch;
    for (let i = 0; i < length; ++i) {
      touch = event.changedTouches[i];
      this.connection.send<any>({
        type: messageType,
        identifier: touch.identifier,
        x: (touch.clientX / document.documentElement.clientWidth) * 100,
        y: (touch.clientY / document.documentElement.clientHeight) * 100
      });
    }
  }

  @HostListener('touchend', ['$event'])
  touchEnd(event: TouchEvent) {
    event.preventDefault();
    Array.from(event.changedTouches).forEach(touch => {
      this.connection.send<TouchEndMessage>({
        type: 'touchEnd',
        identifier: touch.identifier
      });
    });
  }

  counter(i: number) {
    return new Array(i);
  }
}
