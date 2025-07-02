import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReturnCabComponent } from './return-cab.component';

describe('ReturnCabComponent', () => {
  let component: ReturnCabComponent;
  let fixture: ComponentFixture<ReturnCabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReturnCabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReturnCabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
