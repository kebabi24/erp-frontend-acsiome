import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PoUnreceipCabComponent } from './po-unreceip-cab.component';

describe('PoUnreceipCabComponent', () => {
  let component: PoUnreceipCabComponent;
  let fixture: ComponentFixture<PoUnreceipCabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PoUnreceipCabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PoUnreceipCabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
