import { Component, OnInit, HostListener } from '@angular/core';
import { ApplicationService } from '../application/application.service';
import { IConnection } from '../network/iconnection';
import { TouchMoveMessage, isTouchMoveMessage } from '../network/touch-move-message';
import { TouchEndMessage, isTouchEndMessage } from '../network/touch-end-message';
import { TouchStartMessage, isTouchStartMessage } from '../network/touch-start-message';
import { FingerState } from './finger-state';
import { Subject, Observable } from 'rxjs';

@Component({
  selector: 'app-virtual-glass',
  templateUrl: './virtual-glass.component.html',
  styleUrls: ['./virtual-glass.component.scss']
})
export class VirtualGlassComponent implements OnInit {
  public static readonly FINGER_SIZE = 20;

  private connection: IConnection;
  private localFingers: FingerState[];
  private remoteFingers: FingerState[];
  private localTouch = new Subject<TouchUpdate>();
  private remoteTouch = new Subject<TouchUpdate>();

  constructor(private application: ApplicationService) {
    this.connection = this.application.connection;
    this.localFingers = new Array(10);
    this.remoteFingers = new Array(10);
    for (let i = 0; i < this.remoteFingers.length; ++i) {
      this.localFingers[i] = { isTouching: false,  x: 0, y: 0, dx: 0, dy: 0, timestamp: Date.now() };
      this.remoteFingers[i] = { isTouching: false, x: 0, y: 0, dx: 0, dy: 0, timestamp: Date.now() };
    }
  }

  ngOnInit() {
    this.connection.onDataReceived.subscribe(message => {
      const oldState = this.remoteFingers[message.identifier];
      let state: FingerState;
      if (isTouchStartMessage(message)) {
        state = { isTouching: true, x: 0, y: 0, dx: 0, dy: 0, timestamp: Date.now() };
      } else if (isTouchMoveMessage(message)) {
        state = {
          isTouching: true,
          x: message.x * document.documentElement.clientWidth,
          y: message.y * document.documentElement.clientHeight,
          dx:  !oldState.isTouching ? 0 : message.x - oldState.x,
          dy:  !oldState.isTouching ? 0 :  message.y - oldState.y,
          timestamp: Date.now()
        };
      } else if (isTouchEndMessage(message)) {
        state = { isTouching: false, x: 0, y: 0, dx: 0, dy: 0, timestamp: Date.now() };
      }

      if (state !== undefined) {
        this.remoteFingers[message.identifier] = state;
        this.remoteTouch.next({ identifier: message.identifier, state });
      }
    });

    this.detectTouches(this.localTouch, this.remoteFingers);
    this.detectTouches(this.remoteTouch, this.localFingers);
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
      const newUpdate = {
        identifier: touch.identifier,
        state: {
          isTouching: true,
          x: touch.clientX,
          y: touch.clientY,
          dx: messageType === 'touchStart' || !oldState.isTouching ? 0 : x - oldState.x,
          dy: messageType === 'touchStart' || !oldState.isTouching ? 0 : y - oldState.y,
          timestamp: Date.now()
        }
      };
      this.localFingers[touch.identifier] = newUpdate.state;
      this.localTouch.next(newUpdate);
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
        state: { isTouching: false, x: 0, y: 0, dx: 0, dy: 0, timestamp: Date.now() }
      });
    });
  }

  private detectTouches(observable: Observable<TouchUpdate>, fingers: FingerState[]) {
    observable.subscribe(update => {
      const state = update.state;
      if (state.isTouching) {
        let finger: FingerState;
        for (let i = 0; i < fingers.length; ++i) {
          finger = fingers[i];
          if (finger.isTouching &&
            Math.abs(state.x - finger.x + VirtualGlassComponent.FINGER_SIZE / 2) <= VirtualGlassComponent.FINGER_SIZE &&
            Math.abs(state.y - finger.y + VirtualGlassComponent.FINGER_SIZE / 2) <= VirtualGlassComponent.FINGER_SIZE
          ) {
            // const relativeVelocityX = state.dx - finger.dx;
            // const relativeVelocityY = state.dy - finger.dy;
            // const relativeVelocity = Math.sqrt(Math.pow(relativeVelocityX, 2) + Math.pow(relativeVelocityY, 2));
            // console.log(state.dx, state.dy, Math.abs(relativeVelocity));
            window.navigator.vibrate([10, 10]);
            break;
          }
        }
      }
    });
  }

  counter(i: number) {
    return new Array(i);
  }
}

interface TouchUpdate { identifier: number; state: FingerState; }
