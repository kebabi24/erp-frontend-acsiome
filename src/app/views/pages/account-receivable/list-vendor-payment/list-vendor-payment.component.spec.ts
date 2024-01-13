import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListVendorPaymentComponent } from './list-vendor-payment.component';

describe('ListVendorPaymentComponent', () => {
  let component: ListVendorPaymentComponent;
  let fixture: ComponentFixture<ListVendorPaymentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListVendorPaymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListVendorPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
