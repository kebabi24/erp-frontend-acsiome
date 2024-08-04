import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateChargePaymentComponent } from './create-charge-payment.component';

describe('CreateChargePaymentComponent', () => {
  let component: CreateChargePaymentComponent;
  let fixture: ComponentFixture<CreateChargePaymentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateChargePaymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateChargePaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
