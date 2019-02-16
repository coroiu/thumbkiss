import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FingerComponent } from './finger.component';

describe('FingerComponent', () => {
  let component: FingerComponent;
  let fixture: ComponentFixture<FingerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FingerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FingerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
