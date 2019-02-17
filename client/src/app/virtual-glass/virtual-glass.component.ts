import { Component, OnInit, HostListener } from '@angular/core';
import { ApplicationService } from '../application/application.service';
import { IConnection } from '../network/iconnection';
import { TouchMoveMessage, isTouchMoveMessage } from '../network/touch-move-message';
import { TouchEndMessage, isTouchEndMessage } from '../network/touch-end-message';
import { TouchStartMessage, isTouchStartMessage } from '../network/touch-start-message';
import { FingerState } from './finger-state';
import { Subject } from 'rxjs';
import { SimpleFingerState } from './fog/finger-state';

@Component({
  selector: 'app-virtual-glass',
  templateUrl: './virtual-glass.component.html',
  styleUrls: ['./virtual-glass.component.scss']
})
export class VirtualGlassComponent implements OnInit {
  private connection: IConnection;
  private localFingers: FingerState[];
  private remoteFingers: FingerState[];
  private localTouch = new Subject<{ identifier: number, state: FingerState }>();
  private remoteTouch = new Subject<{ identifier: number, state: FingerState }>();

  constructor(private application: ApplicationService) {
    this.connection = this.application.connection;
    this.localFingers = new Array(10);
    this.remoteFingers = new Array(10);
    for (let i = 0; i < this.remoteFingers.length; ++i) {
      this.localFingers[i] = { isTouching: false,  x: 0, y: 0, dx: 0, dy: 0 };
      this.remoteFingers[i] = { isTouching: false, x: 0, y: 0, dx: 0, dy: 0 };
    }
  }

  ngOnInit() {
    this.connection.onDataReceived.subscribe(message => {
      const oldState = this.remoteFingers[message.identifier];
      let state: FingerState;
      if (isTouchStartMessage(message)) {
        state = { isTouching: true, x: 0, y: 0, dx: 0, dy: 0 };
      } else if (isTouchMoveMessage(message)) {
        state = {
          isTouching: true,
          x: message.x,
          y: message.y,
          dx: message.x - oldState.x,
          dy: message.y - oldState.y,
        };
      } else if (isTouchEndMessage(message)) {
        state = { isTouching: false, x: 0, y: 0, dx: 0, dy: 0 };
      }

      if (state !== undefined) {
        this.remoteFingers[message.identifier] = state;
        this.remoteTouch.next({ identifier: message.identifier, state });
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
      const x = (touch.clientX / document.documentElement.clientWidth);
      const y = (touch.clientY / document.documentElement.clientHeight);
      this.connection.send<any>({
        type: messageType, identifier: touch.identifier, x, y
      });

      const oldState = this.localFingers[touch.identifier];
      this.localTouch.next({
        identifier: touch.identifier,
        state: {
          isTouching: true,
          x,
          y,
          dx: messageType === 'touchStart' ? 0 : x - oldState.x,
          dy: messageType === 'touchStart' ? 0 : y - oldState.y
        }
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

      this.localTouch.next({
        identifier: touch.identifier,
        state: { isTouching: false, x: 0, y: 0, dx: 0, dy: 0 }
      });
    });
  }

  counter(i: number) {
    return new Array(i);
  }
}
