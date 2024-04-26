import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePaymentCustComponent } from './create-payment-cust.component';

describe('CreatePaymentCustComponent', () => {
  let component: CreatePaymentCustComponent;
  let fixture: ComponentFixture<CreatePaymentCustComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreatePaymentCustComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatePaymentCustComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
