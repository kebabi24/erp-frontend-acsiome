import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseReceiptColorantComponent } from './purchase-receipt-colorant.component';

describe('PurchaseReceiptColorantComponent', () => {
  let component: PurchaseReceiptColorantComponent;
  let fixture: ComponentFixture<PurchaseReceiptColorantComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PurchaseReceiptColorantComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchaseReceiptColorantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
