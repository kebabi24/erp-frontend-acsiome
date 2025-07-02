import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AttestationReservationComponent } from './attestation-reservation.component';

describe('AttestationReservationComponent', () => {
  let component: AttestationReservationComponent;
  let fixture: ComponentFixture<AttestationReservationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AttestationReservationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttestationReservationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
