import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EchantillonReceiptCabComponent } from './echantillon-receipt-cab.component';

describe('EchantillonReceiptCabComponent', () => {
  let component: EchantillonReceiptCabComponent;
  let fixture: ComponentFixture<EchantillonReceiptCabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EchantillonReceiptCabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EchantillonReceiptCabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
