import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportInvoiceIhComponent } from './export-invoice-ih.component';

describe('ExportInvoiceIhComponent', () => {
  let component: ExportInvoiceIhComponent;
  let fixture: ComponentFixture<ExportInvoiceIhComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExportInvoiceIhComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExportInvoiceIhComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
