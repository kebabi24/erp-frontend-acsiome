import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReprintInvoiceComponent } from './reprint-invoice.component';

describe('ReprintInvoiceComponent', () => {
  let component: ReprintInvoiceComponent;
  let fixture: ComponentFixture<ReprintInvoiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReprintInvoiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReprintInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
