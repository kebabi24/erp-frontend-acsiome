import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseReceiptCabComponent } from './purchase-receipt-cab.component';

describe('PurchaseReceiptCabComponent', () => {
  let component: PurchaseReceiptCabComponent;
  let fixture: ComponentFixture<PurchaseReceiptCabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PurchaseReceiptCabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchaseReceiptCabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
