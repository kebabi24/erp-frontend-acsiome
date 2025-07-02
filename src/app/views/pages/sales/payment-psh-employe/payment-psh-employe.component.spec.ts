import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentPshEmployeComponent } from './payment-psh-employe.component';

describe('PaymentPshEmployeComponent', () => {
  let component: PaymentPshEmployeComponent;
  let fixture: ComponentFixture<PaymentPshEmployeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentPshEmployeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentPshEmployeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
