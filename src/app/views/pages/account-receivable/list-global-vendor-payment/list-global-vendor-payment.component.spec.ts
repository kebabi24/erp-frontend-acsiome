import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListGlobalVendorPaymentComponent } from './list-global-vendor-payment.component';

describe('ListGlobalVendorPaymentComponent', () => {
  let component: ListGlobalVendorPaymentComponent;
  let fixture: ComponentFixture<ListGlobalVendorPaymentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListGlobalVendorPaymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListGlobalVendorPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
