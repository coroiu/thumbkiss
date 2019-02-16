import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VirtualGlassComponent } from './virtual-glass.component';

describe('VirtualGlassComponent', () => {
  let component: VirtualGlassComponent;
  let fixture: ComponentFixture<VirtualGlassComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VirtualGlassComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VirtualGlassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
