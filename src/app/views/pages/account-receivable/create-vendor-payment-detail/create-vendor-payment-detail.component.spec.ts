import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateVendorPaymentDetailComponent } from './create-vendor-payment-detail.component';

describe('CreateVendorPaymentDetailComponent', () => {
  let component: CreateVendorPaymentDetailComponent;
  let fixture: ComponentFixture<CreateVendorPaymentDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateVendorPaymentDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateVendorPaymentDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
