import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentAuComponent } from './payment-au.component';

describe('PaymentAuComponent', () => {
  let component: PaymentAuComponent;
  let fixture: ComponentFixture<PaymentAuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentAuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentAuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
