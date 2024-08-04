import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReprintCabComponent } from './reprint-cab.component';

describe('ReprintCabComponent', () => {
  let component: ReprintCabComponent;
  let fixture: ComponentFixture<ReprintCabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReprintCabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReprintCabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
