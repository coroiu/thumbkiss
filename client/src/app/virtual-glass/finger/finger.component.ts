import { Component, OnInit, Input } from '@angular/core';
import { FingerState } from '../finger-state';

@Component({
  selector: 'app-finger',
  templateUrl: './finger.component.html',
  styleUrls: ['./finger.component.scss']
})
export class FingerComponent implements OnInit {
  @Input() state: FingerState;

  constructor() { }

  ngOnInit() {
  }

}
