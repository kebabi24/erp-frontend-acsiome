import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintInvoiceSeqComponent } from './print-invoice-seq.component';

describe('PrintInvoiceSeqComponent', () => {
  let component: PrintInvoiceSeqComponent;
  let fixture: ComponentFixture<PrintInvoiceSeqComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrintInvoiceSeqComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintInvoiceSeqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
