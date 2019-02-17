import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { Observable } from 'rxjs';
import { interval } from 'rxjs';
import { takeUntil, debounceTime, startWith, switchMap, tap, take } from 'rxjs/operators';
import { SimpleFingerState } from './finger-state';

@Component({
  selector: 'app-fog',
  templateUrl: './fog.component.html',
  styleUrls: ['./fog.component.scss']
})
export class FogComponent implements OnInit {
  @Input() touch: Observable<{identifier: number, state: SimpleFingerState}>;
  @ViewChild('canvas') canvasRef: ElementRef;

  private fingers: SimpleFingerState[];
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;

  constructor() {
    this.fingers = new Array(10);
    for (let i = 0; i < this.fingers.length; ++i) {
      this.fingers[i] = { isTouching: false, x: 0, y: 0 };
    }
  }

  ngOnInit() {
    this.canvas = this.canvasRef.nativeElement;
    this.context = this.canvas.getContext('2d');
    this.canvas.width = document.documentElement.clientWidth;
    this.canvas.height = document.documentElement.clientHeight;
    this.fillCanvas();
    this.touch.subscribe(t => {
      const previousState = this.fingers[t.identifier];
      const coordinates = this.convertToLocalCoordinates({ x: t.state.x, y: t.state.y });
      const newState = {
        ...t.state,
        x: coordinates.x,
        y: coordinates.y
      };
      this.fingers[t.identifier] = newState;

      if (!previousState.isTouching || !newState.isTouching) {
        return;
      }

      this.wipeFog(previousState, newState);
    });

    // Fog restoring observable
    const restoration = interval(100).pipe(
      takeUntil(this.touch),
      take(75),
      tap(() => {
        this.context.fillStyle = 'rgba(255, 255, 255, 0.05)';
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
      })
    );

    // Fog restoration
    this.touch.pipe(
      startWith({ identifier: undefined, state: undefined }),
      debounceTime(7500),
      switchMap(() => restoration)
    ).subscribe();
  }

  private wipeFog(start: Point, end: Point) {
    this.context.globalCompositeOperation = 'destination-out';
    this.context.fillStyle = '#000';
    this.context.strokeStyle = '#000';
    this.context.lineWidth = 25;
    this.context.beginPath();
    this.context.moveTo(start.x, start. y);
    this.context.lineTo(end.x, end.y);
    this.context.closePath();
    this.context.stroke();
    this.context.arc(end.x, end.y, 12.5, 0, 2 * Math.PI);
    this.context.closePath();
    this.context.fill();
    this.context.globalCompositeOperation = 'source-over';
  }

  private convertToLocalCoordinates(point: Point): Point {
    return {
      x: point.x * this.canvas.clientWidth,
      y: point.y * this.canvas.clientHeight
    };
  }

  private fillCanvas() {
    this.context.fillStyle = '#fff';
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }
}

interface Point {
  x: number;
  y: number;
}
