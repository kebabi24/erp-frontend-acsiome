import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BobineReceiptCabComponent } from './bobine-receipt-cab.component';

describe('BobineReceiptCabComponent', () => {
  let component: BobineReceiptCabComponent;
  let fixture: ComponentFixture<BobineReceiptCabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BobineReceiptCabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BobineReceiptCabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
